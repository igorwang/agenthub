"use client";
import LibraryCard, { LibraryCardProps } from "@/components/FunctionTab/libaray-card";
import { ArrowBackIcon, ArrowForwardIcon } from "@/components/ui/icons";
import { Button } from "@nextui-org/button";
import { Spacer } from "@nextui-org/react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const LibrarySideBar: React.FC<{
  cards: LibraryCardProps[];
  setSelectedLibrary: (item: LibraryCardProps) => void;
}> = ({ cards, setSelectedLibrary }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
  });
  const [currentSlide, setCurrentSilide] = useState<number | null>(0);
  const [hasNext, setHasNext] = useState<boolean>();
  const [hasPrev, setHasPrev] = useState<boolean>();

  useEffect(() => {
    const selectedSnap = emblaApi?.selectedScrollSnap();
    if (selectedSnap !== undefined && selectedSnap !== null) {
      setSelectedLibrary(cards[selectedSnap]);
    }
    setHasNext(emblaApi?.canScrollNext);
    setHasPrev(emblaApi?.canScrollPrev);
  }, [emblaApi, cards, currentSlide]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
    setCurrentSilide(emblaApi?.selectedScrollSnap() || 0);
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
    setCurrentSilide(emblaApi?.selectedScrollSnap() || 0);
  }, [emblaApi]);

  const OPTIONS: EmblaOptionsType = { loop: true };

  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="text-nowrap text-xl font-bold">Knowledge of Agent</h1>
      <div className="embla flex max-w-full overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {cards.map((item) => (
            <div key={item.id} className="embla__slide flex min-w-0 shrink-0 basis-full">
              <LibraryCard library={item} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row">
        <Button
          aria-label="back"
          onClick={scrollPrev}
          startContent={<ArrowBackIcon size={30} />}
          // variant="flat"
          variant={hasPrev ? "flat" : "faded"}
          radius="full"
          isIconOnly
          isDisabled={!hasPrev}
        ></Button>
        <Spacer />
        <Button
          aria-label="forward"
          variant={hasNext ? "flat" : "faded"}
          onClick={scrollNext}
          startContent={<ArrowForwardIcon size={30} />}
          isIconOnly
          radius="full"
          isDisabled={!hasNext}
        ></Button>
      </div>
    </div>
  );
};

export default LibrarySideBar;
