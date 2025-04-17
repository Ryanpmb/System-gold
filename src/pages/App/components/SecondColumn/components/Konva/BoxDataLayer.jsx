import { Image } from "react-konva";

export function BoxDataLayer({
    box,
    handleSelect,
    shapesRefs,
    handleMouseEnter,
    handleMouseLeave,
}) {
    return (
        <Image
            image={box.image}
            x={box.x}
            y={box.y}
            width={box.width}
            height={box.height}
            draggable
            ref={(node) => (shapesRefs.current[box.id] = node)}
            onClick={(e) => handleSelect(e, box)}
            onTap={(e) => handleSelect(e, box)}
        />

    )
}