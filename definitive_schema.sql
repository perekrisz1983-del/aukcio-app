CREATE OR REPLACE FUNCTION close_expired_auctions()
RETURNS TABLE (
    closed_auction_id UUID,
    winner_user_id UUID,
    item_title TEXT,
    winning_bid_amount NUMERIC,
    human_readable_id TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH updated_auctions AS (
        UPDATE auctions
        SET
            status = 'Lejárt',
            winner_id = highest_bidder_id
        WHERE
            end_time <= NOW()
            AND status = 'Aktív'
            AND highest_bidder_id IS NOT NULL
        RETURNING id, winner_id, title, current_bid, auction_id_human
    )
    SELECT 
        ua.id,
        ua.winner_id,
        ua.title,
        ua.current_bid,
        ua.auction_id_human
    FROM updated_auctions ua;
END;
$$;