import {
  IconBrandTelegram,
  IconBrandWechat,
  IconBrandXFilled,
  IconHeartFilled,
} from "@tabler/icons-react";
import React, { useCallback, useState } from "react";
import Confetti from "react-confetti";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import Link from "next/link";
import clsx from "clsx";
import { useViewportSize } from "@mantine/hooks";
import { toast } from "sonner";
import { useMomentsUIStateStore } from "@/components/store";
import { Progress } from "@/components/ui/progress";
import useMilestoneData from "./hook";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

const heartColorAndToasterList = [
  { color: "", message: "收到你的爱心！" },
  { color: "text-green-500", message: "催更成功,努力赶工中！" },
  { color: "text-purple-500", message: "感动哭了！" },
  { color: "text-blue-500", message: "你的支持是我最大的动力！" },
  { color: "text-red-500", message: "你的支持是我最大的动力！" },
];

const FeatureFlagPopover = ({
  side = "bottom",
  align = "center",
  milestoneNumber,
  children,
}: {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  milestoneNumber?: number;
  children: React.ReactNode;
}) => {
  dayjs.locale("zh-cn");
  dayjs.updateLocale("zh-cn", {
    relativeTime: {
      future: "%s后",
      past: " %s 前",
      s: "几秒",
      m: " 1 分钟",
      mm: " %d 分钟",
      h: " 1 小时",
      hh: " %d 小时",
      d: " 1 天",
      dd: " %d 天",
      M: " 1 个月",
      MM: " %d 个月",
      y: " 1 年",
      yy: " %d 年",
    },
  });

  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [accordionValue, setAccordionValue] = useState<string | undefined>();
  const { isShowConfetti, setIsShowConfetti } = useMomentsUIStateStore((s) => {
    return {
      isShowConfetti: s.isShowConfetti,
      setIsShowConfetti: s.setIsShowConfetti,
    };
  });
  const { data } = useMilestoneData(milestoneNumber);
  const calcDueOnDate = () => {
    if (!milestoneNumber || !data) {
      return undefined;
    }
    if (data?.due_on) {
      const dueOn = new Date(data.due_on);
      if (dueOn < new Date()) {
        const randomDays = milestoneNumber % 6;
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + randomDays);
        return futureDate;
      }
      return dueOn;
    }
  };
  const dueOnDate = calcDueOnDate();
  const calcProgress = () => {
    if (!data || !dueOnDate) {
      return 0;
    }
    const { created_at } = data;

    const createdAtDate = new Date(created_at);
    const dueOnDateDate = dueOnDate;

    // 计算进度百分比
    const now = new Date().getTime();
    const createdAtTime = createdAtDate.getTime();
    const dueOnDateTime = dueOnDateDate.getTime();

    if (dueOnDateTime <= createdAtTime) {
      return 100;
    }

    const progress = Math.round(
      ((now - createdAtTime) / (dueOnDateTime - createdAtTime)) * 100
    );
    return progress;
  };
  const progress = calcProgress();
  const dueOnDateText = dueOnDate
    ? `预计将于${dayjs(dueOnDate).locale("zh-cn").fromNow()}竣工`
    : "";
  const { width, height } = useViewportSize();
  const reward = () => {
    setIsShowConfetti(true);
    setTimeout(() => {
      setIsShowConfetti(false);
    }, 5000);
  };

  function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }
  const handleHeartClick = useCallback(
    throttle((currentColorIndex: number) => {
      reward();
      setTimeout(() => {
        setCurrentColorIndex((prev) => {
          if (prev < heartColorAndToasterList.length - 1) {
            return prev + 1;
          } else {
            return prev;
          }
        });
        toast.success(<div className="flex flex-1 justify-center items-center text-sm font-semibold">🎉 {heartColorAndToasterList[currentColorIndex]?.message}</div>, {
          position: "top-center",
        });
        if (
          currentColorIndex >= heartColorAndToasterList.length - 1 &&
          !accordionValue &&
          accordionValue !== "item-hidden"
        ) {
          setAccordionValue("item-hidden");
        }
      }, 400);
    }, 5000),
    []
  );

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          sideOffset={5}
          collisionPadding={10}
          side={side}
          align={align}
        >
          <div className="flex w-96 flex-col gap-3 p-3">
            <div className="flex items-center justify-between font-semibold leading-none">
              <div className="flex gap-3 flex-col">
                <span className="flex flex-row items-center justify-start">
                  🚧 此功能正在开发中...
                </span>
                <div className="text-sm text-gray-500">{dueOnDateText}</div>
              </div>
              <Button
                className="w-fit -mr-2"
                size="sm"
                variant="secondary-icon"
                onClick={() => handleHeartClick(currentColorIndex)}
              >
                <IconHeartFilled
                  size={20}
                  className={
                    heartColorAndToasterList[currentColorIndex]?.color +
                    " transition-colors"
                  }
                />
              </Button>
            </div>
            <Progress value={progress} aria-label={`${progress}% increase`} />
            <Accordion
              type="single"
              value={accordionValue}
              collapsible
              onValueChange={(value) => setAccordionValue(value)}
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>关注我们</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 text-xs">
                    欢迎关注我们的 Twitter
                    <Link
                      href={"https://t.me/+2ShleF5Rp-dlMDk1"}
                      className="w-fit"
                      target="_blank"
                    >
                      <Button size="md" className="w-fit">
                        <IconBrandXFilled size={14} />
                        Moments 私有笔记
                      </Button>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>参与共建</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 text-xs">
                    欢迎加入我们的 Telegram 群组。
                    <Link
                      href={"https://t.me/+2ShleF5Rp-dlMDk1"}
                      className="w-fit"
                      target="_blank"
                    >
                      <Button
                        size="md"
                        className="w-fit bg-blue-500 hover:bg-blue-600"
                      >
                        <IconBrandTelegram size={14} />
                        Moments 私有笔记
                      </Button>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-hidden">
                <AccordionTrigger
                  className={clsx({
                    hidden:
                      currentColorIndex < heartColorAndToasterList.length - 1,
                  })}
                >
                  捐助我们
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 text-xs">
                    Moments
                    目前服务器成本高昂，捐助我们可以成为创始会员，获得无限API调用、数据导入技术支持等功能。
                    <Link
                      href={"https://t.me/+0mwZkRKFeL84ZTk1"}
                      className="w-fit"
                      target="_blank"
                    >
                      <Button size="md" className="w-fit">
                        <IconBrandTelegram size={14} />
                        通过 Telegram 联系作者
                      </Button>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
              {/* <AccordionItem value="item-hidden">
                <AccordionTrigger
                  className={clsx({
                    hidden:
                      currentColorIndex < heartColorAndToasterList.length - 1,
                  })}
                >
                  加入创始会员群 (限时免费)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 text-xs">
                    Moments
                    所有功能免费使用，加入创始会员可以获得无限API调用、数据导入技术支持等。您可以加入创始会员群。
                    <Link
                      href={"https://t.me/+0mwZkRKFeL84ZTk1"}
                      className="w-fit"
                      target="_blank"
                    >
                      <Button size="sm" className="w-fit">
                        <IconBrandTelegram size={14} />
                        创始会员群
                      </Button>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem> */}
            </Accordion>
          </div>
        </PopoverContent>
      </Popover>
      {isShowConfetti && (
        <div className="fixed z-40 h-screen w-screen top-0 left-0">
          <Confetti width={width} height={height} recycle={false} />
        </div>
      )}
    </>
  );
};
export { FeatureFlagPopover };
