"use client";
import LibraryCard, {
  LibraryCardProps,
} from "@/components/FunctionTab/libaray-card";
import { ArrowBackIcon, ArrowForwardIcon } from "@/components/ui/icons";
import { Button } from "@nextui-org/button";
import { Spacer } from "@nextui-org/react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const data = [
  {
    id: "1",
    name: "Alice Johnson Alice JohnsonAlice JohnsonAlice JohnsonAlice Johnson ",
    from: "New York, USA",
    description:
      "Alice is a software engineer with a passion for open-source projects.",
  },
  {
    id: "2",
    name: "Bob Smith",
    from: "London, UK",
    description:
      "Bob is a front-end developer who loves creating interactive web applications.",
  },
  {
    id: "3",
    name: "Catherine Lee",
    from: "Sydney, Australia",
    description:
      "Catherine is a UI/UX designer with a keen eye for detail and user experience.",
  },
  {
    id: "4",
    name: "David Kim",
    from: "Seoul, South Korea",
    description:
      "David is a back-end developer with expertise in database management and server-side logic.",
  },
  {
    id: "5",
    name: "Eva Müller",
    from: "Berlin, Germany",
    description:
      "Eva is a full-stack developer who enjoys working on both front-end and back-end technologies.",
  },
];

const LibrarySideBar: React.FC<{
  cards: LibraryCardProps[];
  setSelectedLibrary: (item: LibraryCardProps) => void;
}> = ({ cards, setSelectedLibrary }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
  });
  const [currentSlide, setCurrentSilide] = useState();

  useEffect(() => {
    const selectedSnap = emblaApi?.selectedScrollSnap();

    if (selectedSnap !== undefined && selectedSnap !== null) {
      setSelectedLibrary(cards[selectedSnap]);
    }

    if (emblaApi) {
      console.log(emblaApi.slideNodes()); // Access API
    }
  }, [emblaApi, cards]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const OPTIONS: EmblaOptionsType = { loop: true };

  return (
    <div className="flex flex-col w-full items-center">
      <h1 className="font-bold text-xl text-nowrap">Knowledge of Agent</h1>
      <div className="flex embla max-w-full overflow-hidden " ref={emblaRef}>
        <div className="embla__container flex ">
          {cards.map((item) => (
            <div
              key={item.id}
              className="embla__slide flex shrink-0 basis-full min-w-0"
            >
              <LibraryCard library={item} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row ">
        <Button
          aria-label="back"
          onClick={scrollPrev}
          startContent={<ArrowBackIcon size={30} />}
          variant="flat"
          radius="full"
          isIconOnly
        ></Button>
        <Spacer />
        <Button
          aria-label="forward"
          onClick={scrollNext}
          startContent={<ArrowForwardIcon size={30} />}
          isIconOnly
          variant="flat"
          radius="full"
        ></Button>
      </div>
    </div>
  );
};

export default LibrarySideBar;
