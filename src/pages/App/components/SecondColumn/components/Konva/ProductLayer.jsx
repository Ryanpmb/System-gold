import { Group, Image, Line, Rect, Text } from "react-konva";

export function ProductLayer({
    product,
    index,
    handleSelect,
    handleDragMove,
    handleDragEnd,
    shapesRefs,
    handleTransformEndAndSaveToHistory,
    handleMouseEnter,
    handleMouseLeave,
    enableTextEditing,
    groupRefs,
    handleTransformGroup,
    logo

}) {

    return (
        <>
            <Image
                id={product.id}
                image={product.image}
                key={product.id}
                {...product}
                draggable
                ref={(node) => (shapesRefs.current[product.id] = node)}
                onClick={(e) => handleSelect(e, product)}
                onTap={(e) => handleSelect(e, product)}
                onDragMove={(e) => handleDragMove(e, "product")}
                onDragEnd={(e) => handleDragEnd(product.id, e, 'product')}
                onTransformEnd={() => handleTransformEndAndSaveToHistory("product")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            <Group
                id={product.id + "name"}
                draggable
            >
                <Text
                    key={product.id}
                    text={product?.name ?? null}
                    fontFamily="Microsoft"
                    onDblClick={() => enableTextEditing(product.id, product.x + 200, product.y + 200, product.name)}
                    fontSize={16}
                    x={product.x + 100}
                    y={product.y + 25}
                    fill="black"
                    onClick={handleSelect}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />
            </Group>

            {
                [
                    product.radio === '' && (
                        <Group
                            key={product.id}
                            ref={(node) => (groupRefs.current[index] = node)}
                            onClick={() => { handleTransformGroup(index); }}
                            onTap={() => { handleTransformGroup(index); }}
                            id={Date.now()}
                            draggable
                        >
                            <Text
                                id={product.id + "- $"}
                                key={`${product.id}-empty`}
                                text={product?.valor ?? ""}
                                fontSize={28}
                                x={product.x + 117}
                                y={product.y + 40}
                                fontFamily="Microsoft Bold"
                                letterSpacing={-1}
                                fill="black"
                            />
                            <Text
                                id={product.id + "- price"}
                                key={`${product.id}-empty`}
                                text={'R$'}
                                fontSize={14}
                                x={product.x + 100}
                                y={product.y + 50}
                                fontFamily="Microsoft Bold"
                                fill="black"
                            />
                        </Group>

                    ), product.radio === 'de, por' && (

                        <Group
                            onTap={(e) => { handleTransformGroup(index); }}
                            x={product.x + 80}
                            y={product.y + 25}
                            ref={(node) => (groupRefs.current[index] = node)}
                            onClick={() => handleTransformGroup(index)}
                            draggable
                        >

                            <Text
                                key={`${product.id}-empty 1`}
                                text={'R$' + product?.valor ?? ""}
                                fontSize={16}
                                letterSpacing={-1}
                                fill="black"
                                fontFamily="Microsoft Bold"
                            />



                            <Text
                                key={`${product.id}-empty 2`}
                                text={`R$`}
                                fontSize={14}
                                y={28}
                                fill="red"
                                fontFamily="Microsoft Bold"
                            />

                            <Text
                                key={`${product.id}-empty 2`}
                                text={product?.valor2 ?? ""}
                                fontSize={28}
                                y={20}
                                x={18}
                                fill="red"
                                letterSpacing={-1}
                                fontFamily="Microsoft Bold"
                            />



                            <Group
                                draggable
                            >
                                <Line
                                    points={product?.valor === 0 ? [(0), 18, (30), -5] : [(20), 18, (50), -5]}
                                    stroke={'black'}
                                    strokeWidth={2}

                                />

                                <Line
                                    points={product?.valor === 0 ? [(30), 18, (0), -5] : [(50), 18, (20), -5]}
                                    stroke={'black'}
                                    strokeWidth={2}

                                />
                            </Group>


                        </Group>
                    ),
                    product.radio === "Clube" && product.valor2.split("").length <= 4 && (

                        <Group
                            ref={(node) => (groupRefs.current[index] = node)}
                            onClick={(e) => { handleTransformGroup(index); }}
                            onTap={(e) => { handleTransformGroup(index); }}
                            x={product.x + 73}
                            y={product.y + 20}

                            id={Date.now()}
                            draggable
                        >
                            <Text
                                key={`${product.id}-empty`}
                                text={`R$` + product?.valor ?? ""}
                                fontFamily="Microsoft Bold"
                                fontSize={16}
                                letterSpacing={-1}
                                x={10}
                                y={7}
                                fill="black"
                            />


                            <Rect
                                width={156}
                                height={42}
                                y={30}
                                cornerRadius={20}
                                fillRadialGradientColorStops={[
                                    0, 'yellow',
                                    0.7, 'rgba(255, 200, 0, 0.9)',
                                    1, 'rgba(255, 140, 0, 1)'
                                ]}
                                fillRadialGradientStartPoint={{ x: 78, y: 21 }}
                                fillRadialGradientEndPoint={{ x: 78, y: 21 }}
                                fillRadialGradientStartRadius={0}
                                fillRadialGradientEndRadius={80}
                                stroke="rgba(255, 140, 0, 0.8)"
                                strokeWidth={2}
                            />



                            <Image
                                image={logo ? logo : null}
                                width={50}
                                height={20}
                                x={90}
                                y={40}
                            />


                            <Text
                                key={`${product.id}-empty`}
                                text={product.valor2 ?? ""}
                                fontSize={28}
                                // draggable
                                x={26}
                                y={40}
                                fill="red"
                                letterSpacing={-1}
                                fontFamily="Microsoft Bold"
                            />
                            <Text
                                key={`${product.id}-empty`}
                                text={`R$`}
                                fontSize={14}
                                // draggable
                                x={10}
                                y={49}
                                fill="red"
                                letterSpacing={-1}
                                fontFamily="Microsoft Bold"
                            />


                        </Group>

                    ),

                    product.radio === "Clube" && product.valor2.split("").length === 5 && (

                        <Group
                            ref={(node) => (groupRefs.current[index] = node)}
                            onClick={(e) => { handleTransformGroup(index); }}
                            onTap={(e) => { handleTransformGroup(index); }}
                            x={product.x + 73}
                            y={product.y + 20}

                            id={Date.now()}
                            draggable
                        >
                            <Text
                                key={`${product.id}-empty`}
                                text={`R$` + product?.valor ?? ""}
                                fontFamily="Microsoft Bold"
                                fontSize={16}
                                letterSpacing={-1}
                                x={10}
                                y={7}
                                fill="black"
                            />


                            <Rect
                                width={166.5}
                                height={42}
                                y={30}
                                cornerRadius={20}
                                fillRadialGradientColorStops={[
                                    0, 'yellow',
                                    0.7, 'rgba(255, 200, 0, 0.9)',
                                    1, 'rgba(255, 140, 0, 1)'
                                ]}
                                fillRadialGradientStartPoint={{ x: 78, y: 21 }}
                                fillRadialGradientEndPoint={{ x: 78, y: 21 }}
                                fillRadialGradientStartRadius={0}
                                fillRadialGradientEndRadius={80}
                                stroke="rgba(255, 140, 0, 0.8)"
                                strokeWidth={2}
                            />



                            <Image
                                image={logo ? logo : null}
                                width={50}
                                height={38}
                                x={105}
                                y={33}

                            />


                            <Text
                                key={`${product.id}-empty`}
                                text={product.valor2 ?? ""}
                                fontSize={28}
                                // draggable
                                x={26}
                                y={40}
                                fill="red"
                                letterSpacing={-1}
                                fontFamily="Microsoft Bold"
                            />
                            <Text
                                key={`${product.id}-empty`}
                                text={`R$`}
                                fontSize={14}
                                // draggable
                                x={10}
                                y={49}
                                fill="red"
                                letterSpacing={-1}
                                fontFamily="Microsoft Bold"
                            />


                        </Group>

                    ),

                    product.radio === "Clube" && product.valor2.split("").length === 6 && (

                        <Group
                            ref={(node) => (groupRefs.current[index] = node)}
                            onClick={(e) => { handleTransformGroup(index); }}
                            onTap={(e) => { handleTransformGroup(index); }}
                            x={product.x + 73}
                            y={product.y + 20}

                            id={Date.now()}
                            draggable
                        >
                            <Text
                                key={`${product.id}-empty`}
                                text={`R$` + product?.valor ?? ""}
                                fontFamily="Microsoft Bold"
                                fontSize={16}
                                letterSpacing={-1}
                                x={10}
                                y={7}
                                fill="black"
                            />


                            <Rect
                                width={182.5}
                                height={42}
                                y={30}
                                cornerRadius={20}
                                fillRadialGradientColorStops={[
                                    0, 'yellow',
                                    0.7, 'rgba(255, 200, 0, 0.9)',
                                    1, 'rgba(255, 140, 0, 1)'
                                ]}
                                fillRadialGradientStartPoint={{ x: 78, y: 21 }}
                                fillRadialGradientEndPoint={{ x: 78, y: 21 }}
                                fillRadialGradientStartRadius={0}
                                fillRadialGradientEndRadius={80}
                                stroke="rgba(255, 140, 0, 0.8)"
                                strokeWidth={2}
                            />



                            <Image
                                image={logo ? logo : null}
                                width={50}
                                height={20}
                                x={115}
                                y={40}
                            />


                            <Text
                                key={`${product.id}-empty`}
                                text={product.valor2 ?? ""}
                                fontSize={28}
                                // draggable
                                x={26}
                                y={40}
                                fill="red"
                                letterSpacing={-1}
                                fontFamily="Microsoft Bold"
                            />
                            <Text
                                key={`${product.id}-empty`}
                                text={`R$`}
                                fontSize={14}
                                // draggable
                                x={10}
                                y={49}
                                fill="red"
                                letterSpacing={-1}
                                fontFamily="Microsoft Bold"
                            />


                        </Group>

                    )

                ]
            }


        </>
    )
}