-- 创建增加用户积分的函数
CREATE OR REPLACE FUNCTION increment_user_points(
  user_id UUID,
  points INT
)
RETURNS void AS $$
BEGIN
  UPDATE public.user_stats
  SET total_points = total_points + points
  WHERE user_stats.user_id = increment_user_points.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
