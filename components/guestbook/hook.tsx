import { isUndefined, last } from "lodash-es";
import useSWRInfinite from "swr/infinite";

import { type GuestbookDto } from "@/db/dto/guestbook.dto";
const fetcher = (url: string) => fetch(url).then((r) => r.json());
interface ListObjectsRequest {
  pageSize?: number;
  pageNum?: number;
  search?: string;
}

export const useGuestbookFeeds = ({
  pageSize = 20,
  search,
}: ListObjectsRequest) => {
  const getKey = (
    pageIndex: number,
    previousPageData: GuestbookDto[] | null
  ) => {
    if (previousPageData && !previousPageData.length) return null; // 已经到最后一页
    return `/api/guestbook?page=${pageIndex}&limit=${pageSize}`; // SWR key
  };
  const { data, error, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite<GuestbookDto[]>(getKey, fetcher, {
      initialSize: 1,
      // don't reset the page size to 1 (or initialSize if set) when the first page's key changes
      persistSize: true,
      // to revalidate jobs queue when the component is re-mounted
      revalidateOnMount: true,
      // whether to poll when the window is invisible
      refreshWhenHidden: false,
      // whether to poll when the browser is offline
      refreshWhenOffline: false,
      // whether to retry when fetcher has an error
      shouldRetryOnError: true,
      // automatically revalidate when window gets focused
      revalidateOnFocus: false,
      // automatically revalidate when the browser regains a network connection
      revalidateOnReconnect: true,
      revalidateFirstPage: true,
    });
  // isEmpty ==> first element of data array has value, and the result field is empty
  const isEmpty = data?.[0]?.length === 0;
  // isReachingEnd ==> isEmpty or data array has value and the last element of data array
  // has result length smaller than the desired page size
  const lastResponseData = last(data);
  const isReachingEnd =
    isEmpty ||
    (data &&
      lastResponseData &&
      !isUndefined(lastResponseData) &&
      lastResponseData.length < pageSize);
  return {
    data,
    error,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading,
    isReachingEnd,
  };
};
