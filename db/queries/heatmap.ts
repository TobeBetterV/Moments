import dayjs from "dayjs";
import { eq, gte } from "drizzle-orm";

import { db } from "@/db";
import { guestbook } from "@/db/schema";

const calculateDailyPosts = (posts: { createdAt: Date | null }[]) => {
  const dailyPosts: Record<string, number> = {};

  posts.forEach((post) => {
    const date = dayjs(post.createdAt).format("YYYY-MM-DD");
    if (!dailyPosts[date]) {
      dailyPosts[date] = 0;
    }
    dailyPosts[date]++;
  });

  return dailyPosts;
};
const generateHeatmapData = (dailyPosts: Record<string, number>) => {
  const heatmapData = [];

  for (let i = 0; i < 90; i++) {
    const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
    heatmapData.push({
      date: date,
      count: dailyPosts[date] || 0,
    });
  }

  return heatmapData.reverse(); // 按时间顺序排列
};
type WeeklyCounts = number[][];

const convertData = (
  data: {
    date: string;
    count: number;
  }[]
): WeeklyCounts => {
  const weeks: WeeklyCounts = [];
  let currentWeek: number[] = [];

  data.forEach((item, index) => {
    currentWeek.push(item.count);
    if ((index + 1) % 7 === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // 如果最后一周的数据不足7天，补全0
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(0);
    }
    weeks.push(currentWeek);
  }

  return weeks;
};

const getHeatmapData = async () => {
  const ninetyDaysAgo = dayjs().subtract(90, "day").toDate();

  const recentPosts = await db
    .select({
      createdAt: guestbook.createdAt,
    })
    .from(guestbook)
    .where(
      gte(guestbook.updatedAt, ninetyDaysAgo) && eq(guestbook.isDeleted, false)
    );
  const dailyPosts = calculateDailyPosts(recentPosts);
  const heatmapData = generateHeatmapData(dailyPosts);

  return convertData(heatmapData);
};
export { getHeatmapData };
