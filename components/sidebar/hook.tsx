import useSWR from "swr";

import { type GetInfoResponse } from "@/app/api/info/route";
import { type GetTagListResponse } from "@/app/api/tag/route";

const useInfo = () => {
  const { data, mutate } = useSWR<GetInfoResponse>("/api/info", (url: string) =>
    fetch(url).then((r) => r.json())
  );
  return { data, mutate };
};

const useTags = () => {
  const { data, mutate } = useSWR<GetTagListResponse>(
    "/api/tag",
    (url: string) => fetch(url).then((r) => r.json())
  );
  return { data: data?.tags, mutate };
};
export { useInfo, useTags };
