import { CommentedHighlight } from "@/components/PdfViewer/types";
import { Image, ScrollShadow } from "@nextui-org/react";

interface PdfViewerSidebarProps {
  highlights: Array<CommentedHighlight>;
}

export default function PdfViewerSidebar({ highlights }: PdfViewerSidebarProps) {
  const scrollToHighlight = (highlight: CommentedHighlight) => {
    document.location.hash = `highlight-${highlight.id}`;
  };

  return (
    <div className="h-full w-[25vw] max-w-[500px] bg-content1 p-4">
      <ScrollShadow className="h-full">
        {highlights.length > 0 ? (
          <div className="space-y-4">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                onClick={() => scrollToHighlight(highlight)}
                className="group cursor-pointer border-l-4 border-transparent bg-background/40 px-4 py-3 transition-all hover:border-l-primary hover:bg-default-100">
                <div className="space-y-2">
                  <p className="font-medium text-foreground/90">{highlight.comment}</p>

                  {highlight.content.text && (
                    <blockquote className="border-l-2 border-default-200 pl-3 text-sm text-default-500">
                      {`${highlight.content.text.slice(0, 90).trim()}…`}
                    </blockquote>
                  )}

                  {highlight.content.image && (
                    <Image
                      src={highlight.content.image}
                      alt="Highlight screenshot"
                      classNames={{
                        wrapper: "w-full",
                        img: "rounded-lg object-cover",
                      }}
                      radius="lg"
                      loading="lazy"
                    />
                  )}

                  <p className="text-xs text-default-400">
                    Page {highlight.position.boundingRect.pageNumber}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-default-400">No highlights added yet</p>
        )}
      </ScrollShadow>
    </div>
  );
}
