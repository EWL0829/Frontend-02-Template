function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    for (let prop in element.computedStyle) {
        const p = element.computedStyle.value;

        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }

        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
}

function layout(element) {
    // 如果当前元素没有样式属性，那么就不进行排版
    if (!element.computedStyle) {
        return;
    }

    // 对于style进行一些预处理
    // 例如对一些有px单位的属性，将其转换成为纯数字，方便计算
    const elementStyle = getStyle(element);

    // 如果当前元素不是flex布局，那么暂时不为其进行排版工作
    if (elementStyle.display !== 'flex') {
        return;
    }

    // type为text的文本节点需要被剔除掉
    const items = element.children.filter(e => e.type === 'element');

    // order属性旨在按顺序排列项目。 这意味着为项目分配了代表其组的整数。
    // 然后，按照该整数（最低的值）首先按照视觉顺序放置项目。
    // 如果多个项目具有相同的整数值，则在该组中按照源顺序对项目进行布局。
    // 具体可以参考此处：https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Ordering_Flex_Items
    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
    });

    const style = elementStyle;

    ['width', 'height'].forEach(size => {
        // 样式属性中的width/height为auto或者空值
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    });

    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
    }

    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch';
    }

    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start';
    }

    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }

    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch';
    }

    let mainSize;
    let mainStart;
    let mainEnd;
    let mainSign;
    let mainBase;
    let crossSize;
    let crossStart;
    let crossEnd;
    let crossSign;
    let crossBase;

    if(style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;
        // 这里对于mainBase做一下我个人的理解：
        // 如果是row那么就说明宽度计算是从左向右开始，由0逐渐增加直到到达容器宽度
        // 如果是row-reverse那么就说明宽度计算是从右向左开始，由容器的最大宽度向左逐渐减少至0甚至为负数，然后开始换行

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexWrap === 'wrap-reverse') {
        // wrap-reverse与wrap的差别是：
        // wrap
        // 1 2 3 4（到4的时候就满了,然后开始换行，向下换行）
        // 5 6（我是新行）
        // wrap-reverse
        // 5 6（我是新行）
        // 1 2 3 4（到4的时候就满了,然后开始换行,但是此时向上换行）

        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    // 如果当前的主轴属性是width，但是其父元素是没有width属性的，那么就会进入autoSize的状态
    let isAutoMainSize = false;
    if (!style[mainSize]) { // auto sizing
        elementStyle[mainSize] = 0;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            const itemStyle = getStyle(item);

            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
            }
        }

        isAutoMainSize = true;
    }

    let flexLine = [];
    let flexLines = [flexLine];

    let mainSpace = elementStyle[mainSize];
    let crossSpace = 0;


    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);

        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        // 此处的flex属性是指：flex: flex-basis flex-grow flex-shrink
        if (itemStyle.flex) {
            flexLine.push(item);
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];

            if (itemStyle[crossSize] !== null && itemStyle[crossSign] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }

            flexLine.push(item);
        } else {
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }

            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }

            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }

            mainSpace -= itemStyle[mainSize];
        }
    }
    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== (void 0)) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach(function (items) {
            let mainSpace = items.mainSpace;
            let flexTotal = 0;

            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let itemStyle = getStyle(item);

                if (itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }

            if (flexTotal > 0) {
                // 有flex属性的元素
                let currentMain = mainBase;
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);

                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }

                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];

                }
            } else {
                let step;
                let currentMain;
                // 没有一个元素有flex属性
                if (style.justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'center') {
                    currentMain = mainSpace / 2 * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'space-between') {
                    step = mainSpace / (items.length - 1) * mainSign;
                    currentMain = mainBase;
                }
                if (style.justifyContent === 'space-around') {
                    step = mainSpace / items.length * mainSign;
                    currentMain = step / 2 + mainBase;
                }

                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }
            }
        })
    }

    // let crossSpace;

    if (!style[crossSize]) {
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (let i = 0; i < flexLines.length; i++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossSpace = style[crossSize];
    } else {
        crossBase = 0;
    }

    let lineSize = style[crossSize] / flexLines.length;
    let step;
    if (style.alignContent === 'flex-start') {
        crossBase = 0;
        step = 0;
    }

    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    }

    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }

    if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }

    if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2;
    }

    if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach(function (items) {
        var lineCrossSize = style.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length : items.crossSpace;

        for (let i = 0; i < items.length; i++) {
            var item = items[i];
            var itemStyle = getStyle(item);

            var align = itemStyle.alignSelf || style.alignItems;

            if (itemStyle[crossSize] === null) {
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
            }

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }

            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }

            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossStart] = itemStyle[crossEnd] + crossSign * itemStyle[crossSize];
            }

            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null) && itemStyle[crossSize]);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
            }
        }

        crossBase += crossSign * (lineCrossSize + step);
    });
    console.log(items);
}


module.exports = layout;
