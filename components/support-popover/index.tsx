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
import "dayjs/locale/zh-cn";

const heartColorAndToasterList = [
  { color: "", message: "收到你的爱心！" },
  { color: "text-green-500", message: "催更成功,努力赶工中！" },
  { color: "text-purple-500", message: "感动哭了！" },
  { color: "text-blue-500", message: "你的支持是我最大的动力！" },
  { color: "text-red-500", message: "你的支持是我最大的动力！" },
];

const SupportPopover = ({
  side = "bottom",
  align = "center",
  children,
}: {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  children: React.ReactNode;
}) => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [accordionValue, setAccordionValue] = useState<string | undefined>();
  const { isShowConfetti, setIsShowConfetti } = useMomentsUIStateStore((s) => {
    return {
      isShowConfetti: s.isShowConfetti,
      setIsShowConfetti: s.setIsShowConfetti,
    };
  });
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
                  成为 Moments 产品好友
                </span>
                <div className="text-sm text-gray-500">添加我们向我们反馈你遇到的问题</div>
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
            <Accordion
              type="single"
              value={accordionValue}
              defaultValue="item-1"
              collapsible
              onValueChange={(value) => setAccordionValue(value)}
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger><div className="flex flex-row justify-start items-center gap-2"><IconBrandXFilled size={16} />Twitter</div></AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 text-xs">
                    <Link
                      href={"https://t.me/+2ShleF5Rp-dlMDk1"}
                      className="w-fit"
                      target="_blank"
                    >
                      <Button size="md" className="w-fit">
                        <IconBrandXFilled size={14} />
                        关注 Moments
                      </Button>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger><div className="flex flex-row justify-start items-center gap-2"><IconBrandTelegram size={16} />Telegram</div></AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 text-xs">
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
              <AccordionItem value="item-3">
                <AccordionTrigger><div className="flex flex-row justify-start items-center gap-2"><IconBrandWechat size={16} />Wechat</div></AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 text-xs">
                    <Link
                      href={"https://t.me/+2ShleF5Rp-dlMDk1"}
                      className="w-fit"
                      target="_blank"
                    >
                      <Button
                        size="md"
                        className="w-fit bg-green-500 hover:bg-green-600"
                      >
                        <IconBrandWechat size={14} />
                        添加作者微信
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
                  加入创始会员群 (享受专属服务)
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
              </AccordionItem>
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
export { SupportPopover };
