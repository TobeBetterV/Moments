import { GITHUB_MILESTONES_API_PREFIX } from "@/constants";
import useSWR from "swr";

type GetMilestoneResponse = {
  html_url: string;
  title: string;
  description: string;
  id: number | string;
  creator: {
    stie_admin: boolean;
  };
  open_issues: number;
  closed_issues: number;
  state: string;
  created_at: string;
  updated_at: string;
  due_on: string;
  closed_at: string;
};

const useMilestoneData = (milestoneNumber?: number) => {
  const { data, mutate } = useSWR<GetMilestoneResponse>(
    `${GITHUB_MILESTONES_API_PREFIX}${milestoneNumber}`,
    (url: string) => fetch(url).then((r) => r.json())
  );
  return { data, mutate };
}

export default useMilestoneData;