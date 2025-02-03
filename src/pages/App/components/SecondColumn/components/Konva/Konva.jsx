import { Layer, Rect, Circle, Stage, Text, Transformer, Line, Image, Star, Path, Group } from "react-konva";
import iconWhats from "../../../../../../sources/icons konva/whats.png"
import iconTel from "../../../../../../sources/icons konva/tel.png"
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useStamps } from '../../../../../../contexts/StampsContext';
import { useBox } from "../../../../../../contexts/BoxContext";
import { getClubImage } from "../../../../../../services/User/User";
import { Button } from "../../../../../../components/button/button";
import { Plus } from "lucide-react";

export const Konva = ({
    setStageQuantity,
    stageQuantity,
    handleTransformEndAndSaveToHistory,
    saveToHistory,
    groupRefs,
    handleTransformGroup,
    groupActive,

    selectedElements,
    handleDeselect,
    shapesRefs,
    selectedTabloid,
    stageRef,
    setSelectedShape,
    setSelectedText,
    backgroundImage,
    desabilitarBackground,
    handleMouseEnter,
    handleMouseLeave,
    setShapes,
    shapes,
    handleSelect,
    handleDragMove,
    handleDragEnd,
    selectedShape,
    transformerRef,
    guides,
    copies,
    products,
    isBold,
    selectedText,
    texts,
    enableTextEditing,
    tempTextValue,
    editingTextIndex,
    handleTextChange,
    saveTextChange,
    inputPosition,
    isValidate,
    formatedDateInitial,
    formatedDateFinal,
    setTexts,
    user,
    adress,



}) => {


    const { id } = useParams()
    const [logo, setLogo] = useState(null)
    const { stampsKonva } = useStamps();
    const { boxData } = useBox();
    const [konvaScale, setKonvaScale] = useState(1);
    const [positionKonva, setPositionKonva] = useState({ x: 0, y: 0 })

    const handleWheel = (e) => {
        e.evt.preventDefault();

        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();

        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        setKonvaScale(newScale);
        setPositionKonva({
            x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
        });

    }

    useEffect(() => {
        const fetchImg = async () => {
            const imgData = await getClubImage(id)
            console.log(imgData)
            const img = new window.Image()
            img.src = imgData.data
            img.onload = () => {
                setLogo(img)
            }

            stageRef.current.batchDraw()
        }

        fetchImg();
    }, [id])




    const [logoWhats, setLogoWhats] = useState(null);
    const [logoTel, setLogoTel] = useState(null);
    const [textSize, setTextSize] = useState({ width: 0, height: 0 });
    const textRefAdress = useRef();

    const informations = user ? JSON.parse(user?.Adress) : null

    useEffect(() => {
        if (textRefAdress.current) {
            // Calcula o tamanho do primeiro texto
            const width = textRefAdress.current.getTextWidth();
            const height = textRefAdress.current.getTextHeight();
            setTextSize({ width, height });
        }
    }, [textRefAdress.current]);

    useEffect(() => {
        const imgWhats = () => {
            const img = new window.Image();
            img.src = iconWhats;
            img.onload = () => { setLogoWhats(img); }

        }
        const imgTel = () => {
            const img = new window.Image();
            img.src = iconTel;
            img.onload = () => {
                setLogoTel(img)
            }
        }

        imgWhats()
        imgTel()
    }, [])


    return (
        <div className="konva-content" style={{ position: "relative", marginRight: '40px', marginTop: "15%" }}>
            {editingTextIndex !== null && (
                <input
                    className="changeText"
                    type="text"
                    value={tempTextValue}
                    onChange={handleTextChange}
                    onBlur={saveTextChange} // Salva ao sair do campo de input
                    autoFocus // Foca no input automaticamente
                    style={{
                        position: "absolute",
                        top: inputPosition.y,
                        left: inputPosition.x,
                        width: 200,
                        border: 0,
                        fontSize: "22px",
                        padding: "4px",
                        background: "#fff",
                        outline: "none",
                        borderRadius: 0,
                        zIndex: 1000
                    }}
                />
            )}
            <Stage
                className="Stage"
                ref={stageRef}
                style={{ border: '1px solid', backgroundColor: 'white' }}
                width={selectedTabloid?.width ?? 600}
                height={selectedTabloid?.height ?? 800}
                scaleX={konvaScale}
                scaleY={konvaScale}
                x={positionKonva.x}
                y={positionKonva.y}
                onWheel={handleWheel}
                onMouseDown={(e) => {
                    if (e.target === e.target.getStage()) {
                        setSelectedShape(null);
                        setSelectedText(null);
                        handleDeselect()
                    }
                }}>

                <Layer>
                    {backgroundImage && (
                        <Image
                            image={backgroundImage}
                            width={selectedTabloid?.width ?? 650}
                            height={selectedTabloid?.height ?? 800}
                            onClick={desabilitarBackground}
                        />
                    )}
                </Layer>


                <Layer
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    id="shapesLayer"
                >
                    {shapes?.map((shape) => {
                        if (shape.type === 'rectangle') {
                            return (
                                <Rect
                                    key={shape.id}
                                    id={shape.id}
                                    cornerRadius={1}
                                    x={shape.x}
                                    y={shape.y}
                                    width={shape.width}
                                    height={shape.height}
                                    isGradient={shape.isGradient}
                                    fill={shape.isGradient ? undefined : shape.fill}
                                    fillLinearGradientStartPoint={shape.isGradient ? shape.fillLinearGradientStartPoint : undefined}
                                    fillLinearGradientEndPoint={shape.isGradient ? shape.fillLinearGradientEndPoint : undefined}
                                    fillLinearGradientColorStops={shape.isGradient ? shape.fillLinearGradientColorStops : undefined}
                                    fillRadialGradientStartRadius={0} // raio inicial do gradiente
                                    fillRadialGradientEndRadius={50}
                                    strokeTam={0}
                                    ref={(node) => (shapesRefs.current[shape.id] = node)}
                                    {...shape}
                                    draggable
                                    onClick={(e) => handleSelect(e, shape)}
                                    onTap={(e) => handleSelect(e, shape)}
                                    onDragMove={(e) => handleDragMove(e, "shape")}
                                    onDragEnd={(e) => handleDragEnd(shape.id, e, 'shape')}
                                    onTransformEnd={() => handleTransformEndAndSaveToHistory("shape")}
                                />
                            );
                        } else if (shape.type === 'circle') {
                            return (
                                <Circle
                                    key={shape.id}
                                    x={shape.x}
                                    y={shape.y}
                                    {...shape}
                                    radius={shape.radius}
                                    draggable
                                    isGradient={shape.isGradient}
                                    fill={shape.isGradient ? undefined : shape.fill}
                                    fillLinearGradientStartPoint={shape.isGradient ? shape.fillLinearGradientStartPoint : undefined}
                                    fillLinearGradientEndPoint={shape.isGradient ? shape.fillLinearGradientEndPoint : undefined}
                                    fillLinearGradientColorStops={shape.isGradient ? shape.fillLinearGradientColorStops : undefined}
                                    onClick={(e) => handleSelect(e, shape)}
                                    onTap={(e) => handleSelect(e, shape)}
                                    ref={(node) => (shapesRefs.current[shape.id] = node)}
                                    onDragMove={(e) => handleDragMove(e, "shape")}
                                    onDragEnd={(e) => handleDragEnd(shape.id, e, 'shape')}
                                    onTransformEnd={() => handleTransformEndAndSaveToHistory("shape")}
                                />
                            );
                        } else if (shape.type === 'star') {
                            return (
                                <Star
                                    key={shape.id}
                                    x={shape.x}
                                    y={shape.y}
                                    isGradient={shape.isGradient}
                                    fill={shape.isGradient ? undefined : shape.fill}
                                    fillLinearGradientStartPoint={shape.isGradient ? shape.fillLinearGradientStartPoint : undefined}
                                    fillLinearGradientEndPoint={shape.isGradient ? shape.fillLinearGradientEndPoint : undefined}
                                    fillLinearGradientColorStops={shape.isGradient ? shape.fillLinearGradientColorStops : undefined}
                                    {...shape}
                                    draggable
                                    numPoints={shape.numPoints}  // Número de pontas da estrela
                                    innerRadius={shape.innerRadius}  // Raio interno
                                    outerRadius={shape.outerRadius}  // Raio externo  
                                    stroke="black"  // Cor da borda
                                    strokeWidth={2}  // Largura da borda
                                    onClick={(e) => handleSelect(e, shape)}
                                    onTap={(e) => handleSelect(e, shape)}
                                    ref={(node) => (shapesRefs.current[shape.id] = node)}
                                    onDragMove={(e) => handleDragMove(e, "shape")}
                                    onDragEnd={(e) => handleDragEnd(shape.id, e, 'shape')}
                                    onTransformEnd={() => handleTransformEndAndSaveToHistory("shape")}
                                />
                            )
                        } else if (shape.type === 'path') {
                            return (
                                <Path
                                    key={shape.id}
                                    type='path'
                                    x={shape.x}
                                    y={shape.y}
                                    {...shape}
                                    fill={shape.isGradient ? undefined : shape.fill}
                                    fillLinearGradientStartPoint={shape.isGradient ? shape.fillLinearGradientStartPoint : undefined}
                                    fillLinearGradientEndPoint={shape.isGradient ? shape.fillLinearGradientEndPoint : undefined}
                                    fillLinearGradientColorStops={shape.isGradient ? shape.fillLinearGradientColorStops : undefined}
                                    draggable
                                    ref={(node) => (shapesRefs.current[shape.id] = node)}
                                    onClick={(e) => handleSelect(e, shape)}
                                    onTap={(e) => handleSelect(e, shape)}
                                    onDragMove={(e) => handleDragMove(e, "shape")}
                                    onDragEnd={(e) => handleDragEnd(shape.id, e, 'shape')}
                                    onTransformEnd={() => handleTransformEndAndSaveToHistory("shape")}
                                />
                            )
                        }
                        return null;
                    })}

                    {selectedShape && (
                        <Transformer
                            ref={transformerRef}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 20 || newBox.height < 20) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                        />
                    )}

                    {selectedElements.length > 0 && (
                        <Transformer
                            ref={transformerRef}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 20 || newBox.height < 20) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                        />
                    )}
                </Layer>

                <Layer>
                    {/* Linha vertical para o alinhamento central */}
                    {guides.vertical && (
                        <Line
                            points={[guides.vertical, 0, guides.vertical, window.innerHeight]}
                            stroke="red"
                            strokeWidth={1}
                            dash={[4, 6]} // Guia tracejada
                        />
                    )}

                    {/* Linha horizontal para o alinhamento central */}
                    {guides.horizontal && (
                        <Line
                            points={[0, guides.horizontal, window.innerWidth, guides.horizontal]}
                            stroke="red"
                            strokeWidth={1}
                            dash={[4, 6]} // Guia tracejada
                        />
                    )}
                </Layer>


                <Layer
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    id="copiesLayer"
                >
                    {copies.map((copy) => {
                        if (copy.image) {
                            return (
                                <Image
                                    key={copy.id}
                                    image={copy.image}
                                    {...copy}
                                    draggable
                                    onClick={(e) => handleSelect(e, copy)}
                                    onTap={(e) => handleSelect(e, copy)}
                                    ref={(node) => (shapesRefs.current[copy.id] = node)}
                                    onDragEnd={(e) => handleDragEnd(copy.id, e, 'copy')}
                                    onTransformEnd={() => handleTransformEndAndSaveToHistory("copy")}
                                />
                            );
                        } else if (copy.radius) {
                            return (
                                <Circle
                                    key={copy.id}
                                    {...copy}
                                    draggable
                                    onClick={(e) => handleSelect(e, copy)}
                                    onTap={(e) => handleSelect(e, copy)}
                                    ref={(node) => (shapesRefs.current[copy.id] = node)}
                                    onDragEnd={(e) => handleDragEnd(copy.id, e, 'copy')}
                                    onTransformEnd={() => handleTransformEndAndSaveToHistory("copy")}
                                />
                            );
                        } else if (copy.text) {
                            return (
                                <Text
                                    text={copy.text}
                                    onDragEnd={(e) => handleDragEnd(copy.id, e, 'copy')}
                                    fontSize={24}
                                    fontStyle={isBold ? 'bold' : 'normal'}
                                    {...copy}
                                    type={'copy'}
                                    draggable
                                    x={copy.x}
                                    y={copy.y}
                                    fill={copy.fill}
                                    onDblClick={() => enableTextEditing(copy.id, copy.x, copy.y, copy.text)}
                                    onClick={(e) => handleSelect(e, copy)}
                                    onTap={(e) => handleSelect(e, copy)}
                                    ref={(node) => (shapesRefs.current[copy.id] = node)}
                                    onTransformEnd={() => handleTransformEndAndSaveToHistory("copy")}
                                />
                            )
                        } else if (copy.data) {
                            return (
                                <Path
                                    {...copy}
                                    onClick={(e) => handleSelect(e, copy)}
                                    onTap={(e) => handleSelect(e, copy)}
                                    ref={(node) => (shapesRefs.current[copy.id] = node)}
                                    onDragEnd={(e) => handleDragEnd(copy.id, e, 'copy')}
                                    onTransformEnd={() => handleTransformEndAndSaveToHistory("copy")}
                                />
                            )
                        } else if (copy.type === 'star') {
                            return (
                                <Star
                                    key={copy.id}
                                    x={copy.x}
                                    y={copy.y}
                                    isGradient={copy.isGradient}
                                    fill={copy.isGradient ? undefined : copy.fill}
                                    fillLinearGradientStartPoint={copy.isGradient ? copy.fillLinearGradientStartPoint : undefined}
                                    fillLinearGradientEndPoint={copy.isGradient ? copy.fillLinearGradientEndPoint : undefined}
                                    fillLinearGradientColorStops={copy.isGradient ? copy.fillLinearGradientColorStops : undefined}
                                    {...copy}
                                    draggable
                                    numPoints={copy.numPoints}  // Número de pontas da estrela
                                    innerRadius={copy.innerRadius}  // Raio interno
                                    outerRadius={copy.outerRadius}  // Raio externo  
                                    stroke="black"  // Cor da borda
                                    strokeWidth={2}  // Largura da borda
                                    onClick={(e) => handleSelect(e, copy)}
                                    onTap={(e) => handleSelect(e, copy)}
                                    ref={(node) => (shapesRefs.current[copy.id] = node)}
                                    onDragMove={(e) => handleDragMove(e, "copy")}
                                    onDragEnd={(e) => handleDragEnd(copy.id, e, 'copy')}
                                    onTransformEnd={() => handleTransformEndAndSaveToHistory("copy")}
                                />
                            )
                        } else {
                            return (
                                <Rect
                                    key={copy.id}
                                    {...copy}
                                    draggable
                                    onClick={(e) => handleSelect(e, copy)}
                                    onTap={(e) => handleSelect(e, copy)}
                                    ref={(node) => (shapesRefs.current[copy.id] = node)}
                                    onDragEnd={(e) => handleDragEnd(copy.id, e, 'copy')}
                                    onTransformEnd={() => handleTransformEndAndSaveToHistory("copy")}
                                />
                            );
                        }
                    })}
                </Layer>

                <Layer
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    id="productLayer"
                >
                    {products?.map((products) => (
                        <Image
                            id={products.id}
                            image={products.image}
                            key={products.id}
                            width={products.image.width}
                            height={products.image.height}
                            {...products}
                            draggable
                            ref={(node) => (shapesRefs.current[products.id] = node)}
                            onClick={(e) => handleSelect(e, products)}
                            onTap={(e) => handleSelect(e, products)}
                            onDragMove={(e) => handleDragMove(e, "product")}
                            onDragEnd={(e) => handleDragEnd(products.id, e, 'product')}
                            onTransformEnd={() => handleTransformEndAndSaveToHistory("product")}
                        />
                    ))}
                    {selectedShape && (
                        <Transformer
                            ref={transformerRef}
                            rotateEnabled={true}
                            enabledAnchors={[
                                'top-left',
                                'top-center',
                                'top-right',
                                'bottom-left',
                                'bottom-center',
                                'bottom-right',
                                'middle-left',
                                'middle-right'
                            ]}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 20 || newBox.height < 20) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                        />
                    )}
                </Layer>

                <Layer
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    id="productLayer"
                >
                    {boxData.map((box) => (
                        <Image
                            id={box.id}
                            key={box.id}
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
                    ))}
                    {selectedShape && (
                        <Transformer
                            ref={transformerRef}
                            rotateEnabled={true}
                            enabledAnchors={[
                                'top-left',
                                'top-center',
                                'top-right',
                                'bottom-left',
                                'bottom-center',
                                'bottom-right',
                                'middle-left',
                                'middle-right'
                            ]}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 20 || newBox.height < 20) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                        />
                    )}
                </Layer>

                <Layer
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {products.map((products) => (
                        <Group
                            x={products.pricePosition}
                            y={products.pricePosition}
                            id={products.id + "name"}
                            draggable
                        >
                            <Text
                                key={products.id}
                                text={products?.name ?? null}
                                fontFamily="Microsoft"
                                onDblClick={() => enableTextEditing(products.id, products.x + 200, products.y + 200, products.name)}
                                fontSize={16}
                                fontStyle={isBold ? 'bold' : 'normal'}
                                x={products.x + 100}
                                y={products.y}
                                fill="black"
                                onClick={handleSelect}
                            />
                        </Group>
                    ))}
                    {selectedText && (
                        <Transformer
                            ref={transformerRef}
                            rotateEnabled={true}
                            enabledAnchors={[
                                'top-left',
                                'top-right',
                                'bottom-left',
                                'bottom-right',
                            ]}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 20 || newBox.height < 20) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                        />
                    )}
                </Layer>
                <Layer
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {products.map((products, index) => [
                        products.radio === '' && (
                            <Group
                                key={products.id}
                                ref={(node) => (groupRefs.current[index] = node)}
                                onClick={() => { handleTransformGroup(index); }}
                                onTap={() => { handleTransformGroup(index); }}
                                id={Date.now()}
                                draggable
                            >
                                <Text
                                    id={products.id + "- $"}
                                    key={`${products.id}-empty`}
                                    text={products?.valor ?? ""}
                                    fontSize={28}
                                    x={products.x + 117}
                                    y={products.y + 20}
                                    fontFamily="Microsoft Bold"
                                    letterSpacing={-1}
                                    fill="black"
                                />
                                <Text
                                    id={products.id + "- price"}
                                    key={`${products.id}-empty`}
                                    text={'R$'}
                                    fontSize={14}
                                    x={products.x + 100}
                                    y={products.y + 30}
                                    fontFamily="Microsoft Bold"
                                    fill="black"
                                />
                            </Group>

                        ), products.radio === 'de, por' && (

                            <Group
                                onTap={(e) => { handleTransformGroup(index); }}
                                x={products.x + 80}
                                y={products.y + 25}
                                ref={(node) => (groupRefs.current[index] = node)}
                                onClick={() => handleTransformGroup(index)}
                                draggable
                            >

                                <Text
                                    key={`${products.id}-empty 1`}
                                    text={'R$' + products?.valor ?? ""}
                                    fontSize={16}
                                    letterSpacing={-1}
                                    fill="black"
                                    fontFamily="Microsoft Bold"
                                />



                                <Text
                                    key={`${products.id}-empty 2`}
                                    text={`R$`}
                                    fontSize={14}
                                    y={28}
                                    fill="red"
                                    fontFamily="Microsoft Bold"
                                />

                                <Text
                                    key={`${products.id}-empty 2`}
                                    text={products?.valor2 ?? ""}
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
                                        points={products?.valor === 0 ? [(0), 18, (30), -5] : [(20), 18, (50), -5]}
                                        stroke={'black'}
                                        strokeWidth={2}

                                    />

                                    <Line
                                        points={products?.valor === 0 ? [(30), 18, (0), -5] : [(50), 18, (20), -5]}
                                        stroke={'black'}
                                        strokeWidth={2}

                                    />
                                </Group>


                            </Group>
                        ),
                        products.radio === "Clube" && products.valor2.split("").length <= 4 && (

                            <Group
                                ref={(node) => (groupRefs.current[index] = node)}
                                onClick={(e) => { handleTransformGroup(index); }}
                                onTap={(e) => { handleTransformGroup(index); }}
                                x={products.x + 73}
                                y={products.y + 20}

                                id={Date.now()}
                                draggable
                            >
                                <Text
                                    key={`${products.id}-empty`}
                                    text={`R$` + products?.valor ?? ""}
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
                                    key={`${products.id}-empty`}
                                    text={products.valor2 ?? ""}
                                    fontSize={28}
                                    // draggable
                                    x={26}
                                    y={40}
                                    fill="red"
                                    letterSpacing={-1}
                                    fontFamily="Microsoft Bold"
                                />
                                <Text
                                    key={`${products.id}-empty`}
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

                        products.radio === "Clube" && products.valor2.split("").length === 5 && (

                            <Group
                                ref={(node) => (groupRefs.current[index] = node)}
                                onClick={(e) => { handleTransformGroup(index); }}
                                onTap={(e) => { handleTransformGroup(index); }}
                                x={products.x + 73}
                                y={products.y + 20}

                                id={Date.now()}
                                draggable
                            >
                                <Text
                                    key={`${products.id}-empty`}
                                    text={`R$` + products?.valor ?? ""}
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
                                    key={`${products.id}-empty`}
                                    text={products.valor2 ?? ""}
                                    fontSize={28}
                                    // draggable
                                    x={26}
                                    y={40}
                                    fill="red"
                                    letterSpacing={-1}
                                    fontFamily="Microsoft Bold"
                                />
                                <Text
                                    key={`${products.id}-empty`}
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

                        products.radio === "Clube" && products.valor2.split("").length === 6 && (

                            <Group
                                ref={(node) => (groupRefs.current[index] = node)}
                                onClick={(e) => { handleTransformGroup(index); }}
                                onTap={(e) => { handleTransformGroup(index); }}
                                x={products.x + 73}
                                y={products.y + 20}

                                id={Date.now()}
                                draggable
                            >
                                <Text
                                    key={`${products.id}-empty`}
                                    text={`R$` + products?.valor ?? ""}
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
                                    key={`${products.id}-empty`}
                                    text={products.valor2 ?? ""}
                                    fontSize={28}
                                    // draggable
                                    x={26}
                                    y={40}
                                    fill="red"
                                    letterSpacing={-1}
                                    fontFamily="Microsoft Bold"
                                />
                                <Text
                                    key={`${products.id}-empty`}
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

                    ])}

                    {groupActive && (
                        <Transformer
                            ref={transformerRef}
                            rotateEnabled={true}
                            enabledAnchors={[
                                'top-left',
                                'top-right',
                                'bottom-left',
                                'bottom-right',
                            ]}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 5 || newBox.height < 5) {
                                    return oldBox;
                                }
                                return newBox;
                            }}

                        />
                    )}



                </Layer>

                <Layer
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    id="textLayer"
                >
                    {texts?.map((textItem) => (

                        <React.Fragment key={textItem.id}>
                            {/* Contorno do texto */}
                            <Text
                                text={textItem.text}
                                fontSize={textItem.fontSize || 24}
                                fontStyle={isBold ? 'bold' : 'normal'}
                                fontFamily="Arial"
                                x={textItem.x}
                                y={textItem.y}
                                fill="transparent" // Deixa o interior transparente
                                stroke={textItem.outline} // Define a cor do contorno
                                strokeWidth={textItem.strokeTam} // Ajusta o strokeWidth com base no fontSize
                                scaleX={textItem.scaleX || 1}  // Aplica a escala X
                                scaleY={textItem.scaleY || 1}  // Aplica a escala Y
                                onClick={handleSelect}
                                {...textItem}

                            />


                            {/* Texto original por cima */}
                            <Text
                                text={textItem.text}
                                onDragEnd={(e) => handleDragEnd(textItem.id, e, 'texts')}
                                fontSize={textItem.fontSize || 24}
                                fontStyle={isBold ? 'bold' : 'normal'}
                                {...textItem}
                                draggable
                                x={textItem.x}
                                y={textItem.y}
                                stroke={null}
                                fill="black"
                                onDblClick={() => enableTextEditing(textItem.id, textItem.x, textItem.y, textItem.text)}
                                onClick={(e) => handleSelect(e, textItem)}
                                onTap={(e) => handleSelect(e, textItem)}
                                ref={(node) => (shapesRefs.current[textItem.id] = node)}
                                fontFamily="Microsoft"
                            />
                        </React.Fragment>
                    ))}

                    {selectedShape && (
                        <Transformer
                            ref={transformerRef}
                            rotateEnabled={true}
                            enabledAnchors={[
                                'top-left',
                                'top-center',
                                'top-right',
                                'bottom-left',
                                'bottom-center',
                                'bottom-right',
                                'middle-left',
                                'middle-right'
                            ]}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 20 || newBox.height < 20) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                            onTransformEnd={(e) => {
                                console.log('teste')


                                if (selectedShape.attrs.type === 'rectangle') {
                                    console.log("dale")
                                    const node = transformerRef.current.getNode();
                                    const newWidth = node.width() * node.scaleX();
                                    const newHeight = node.height() * node.scaleY();
                                    const id = selectedShape.attrs.id;

                                    // Atualizar a forma após transformação
                                    setShapes((prevShapes) =>
                                        prevShapes.map((shape) =>
                                            shape.id === id
                                                ? {
                                                    ...shape,
                                                    x: node.x(),
                                                    y: node.y(),
                                                    width: newWidth,
                                                    height: newHeight,
                                                }
                                                : shape
                                        )
                                    );
                                    node.scaleX(1);
                                    node.scaleY(1);
                                }

                                const node = transformerRef.current.getNode();
                                const scaleX = node.scaleX();
                                const scaleY = node.scaleY();
                                const textId = selectedShape.attrs.id;

                                // Atualizar o estado do texto para refletir a nova escala
                                setTexts((prevTexts) =>
                                    prevTexts.map((textItem) =>
                                        textItem.id === textId
                                            ? {
                                                ...textItem,
                                                scaleX: scaleX, // Salvar a escala X
                                                scaleY: scaleY, // Salvar a escala Y
                                                x: node.x(),
                                                y: node.y()
                                            }
                                            : textItem
                                    )
                                );
                            }}
                        />
                    )}
                </Layer>


                <Layer
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {isValidate && (
                        <Text
                            id={Date.now()}
                            type="validate"
                            text={`Promoção valida de ${formatedDateInitial} até ${formatedDateFinal} ou enquanto durar o estoque`}
                            fontSize={16}
                            fontStyle={isBold ? 'bold' : 'normal'}
                            fontFamily="Viga"
                            draggable
                            x={100}
                            y={100}
                            fill="black"
                            // onDblClick={() => enableTextEditing(selectedShape.id, selectedShape.x, selectedShape.y,  selectedShape.text)}
                            onClick={(e) => handleSelect(e, e.target)}
                            onTap={(e) => handleSelect(e, e.target)}
                        // ref={(node) => (shapesRefs.current[copy.id] = node)}
                        />
                    )}
                </Layer>

                <Layer onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <Group
                        x={100} // Posição inicial do grupo no eixo X
                        y={100} // Posição inicial do grupo no eixo Y
                        onClick={handleSelect}
                        draggable // Permite arrastar o grupo inteiro
                    >
                        {informations?.map((info, index) => (
                            <>
                                {/* Endereço */}
                                {adress && (
                                    <Text
                                        type="adress"
                                        key={`adress-${index}`}
                                        text={info.Adress || ''}
                                        fontSize={16}
                                        fontStyle={isBold ? 'bold' : 'normal'}
                                        fill="black"
                                        x={0} // Mantém alinhado no eixo X
                                        y={index * 40} // Ajusta a posição Y dinamicamente
                                        fontFamily="segoeui"
                                    />
                                )}

                                {/* Ícone WhatsApp */}
                                {adress && (
                                    <Image
                                        type="adress"
                                        key={`whatsapp-icon-${index}`}
                                        image={info.Whatsapp ? logoWhats : null}
                                        width={15}
                                        height={15}
                                        x={240} // Ajusta ao lado do endereço
                                        y={index * 40}
                                    />
                                )}

                                {/* Telefone */}
                                {adress && (
                                    <Text
                                        type="adress"
                                        key={`whatsapp-text-${index}`}
                                        text={info.Whatsapp || ''}
                                        fontSize={16}
                                        fontStyle={isBold ? 'bold' : 'normal'}
                                        fill="black"
                                        x={260} // Ajusta ao lado do ícone WhatsApp
                                        y={index * 40}
                                        fontFamily="Viga"
                                    />
                                )}

                                {/* Ícone Telefone */}

                                {adress && (

                                    <Image
                                        type="adress"
                                        key={`telefone-icon-${index}`}
                                        image={info.Telefone ? logoTel : null}
                                        width={15}
                                        height={15}
                                        x={360} // Ajusta ao lado do telefone
                                        y={index * 40}
                                    />
                                )}

                                {adress && (
                                    <Text
                                        type="adress"
                                        key={`telefone-${index}`}
                                        text={info.Telefone || ''}
                                        fontSize={16}
                                        fontStyle={isBold ? 'bold' : 'normal'}
                                        fill="black"
                                        x={380} // Ajusta ao lado do ícone WhatsApp
                                        y={index * 40}
                                        fontFamily="Viga"
                                    />

                                )}


                                {/* Horário de Funcionamento */}
                                {adress && (
                                    <Text
                                        type="adress"
                                        key={`hora-${index}`}
                                        text={info.horaFuncionamento || ''}
                                        fontSize={10}
                                        fontStyle={isBold ? 'bold' : 'normal'}
                                        fill="black"
                                        x={0} // Ajusta ao lado do último ícone
                                        y={index === 0 ? 20 : index * 40 + 20}
                                        fontFamily="Viga"
                                    />
                                )}
                            </>
                        ))}
                    </Group>
                </Layer>


                <Layer
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    id="productLayer"
                >
                    {stampsKonva.map((stamp) => (
                        <Image
                            id={stamp.id}
                            key={stamp.id}
                            image={stamp.image}
                            x={stamp.x}
                            y={stamp.y}
                            width={stamp.width}
                            height={stamp.height}
                            draggable
                            ref={(node) => (shapesRefs.current[stamp.id] = node)}
                            onClick={(e) => handleSelect(e, stamp)}
                            onTap={(e) => handleSelect(e, stamp)}
                        />
                    ))}
                    {selectedShape && (
                        <Transformer
                            ref={transformerRef}
                            rotateEnabled={true}
                            enabledAnchors={[
                                'top-left',
                                'top-center',
                                'top-right',
                                'bottom-left',
                                'bottom-center',
                                'bottom-right',
                                'middle-left',
                                'middle-right'
                            ]}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 20 || newBox.height < 20) {
                                    return oldBox;
                                }
                                return newBox;
                            }}

                        />
                    )}
                </Layer>
            </Stage>

            <div style={{ display: "flex", gap: "10px" }}>

                <Button
                    onClick={() => {
                        setKonvaScale(1)
                        setPositionKonva({ x: 0, y: 0 })
                    }}
                    style={{
                        width: "20%",
                        marginTop: "10px"
                    }}
                >
                    Voltar Padrão
                </Button>

                <Button
                    onClick={() => {
                        setStageQuantity([...stageQuantity, {id: stageQuantity.length + 1, elements: []}])
                    }}
                    style={{
                        width: "10%",
                        marginTop: "10px"
                    }}
                >
                    <Plus />
                </Button>
            </div>
        </div>
    )
}