// this is a popup library made by forest-inlet

function createPopup(
    title = {},
    body = {},
    animation = {},
    option = {}
) {
    title = Object.assign(
        {
            text: 'test',
            textColor: '#000',
            backgroundColor: '#c4c4ff',
            size: '24px'
        },
        title
    );

    body = Object.assign(
        {
            text: 'this is a test',
            isHtml: false,
            centerAligning: false,
            textColor: '#000',
            backgroundColor: '#fff',
            size: '16px'
        },
        body
    );

    animation = Object.assign(
        {
            enter: 0,
            leave: 0
        },
        animation
    );

    const defaultOption = {
        confirm: {
            isConfirm: false,
            true: {
                text: 'OK',
                textColor: '#fff',
                backgroundColor: '#0078ff'
            },
            false: {
                text: 'cancel',
                textColor: '#000',
                backgroundColor: '#ccc'
            }
        },
        callbacks: {
            onOpen: el => {
                console.log('opened', el);
            },
            onClose: res => {
                console.log('closed', res);
            },
            onConfirm: () => {
                console.log('trueBtn pressed');
            },
            onCancel: () => {
                console.log('falseBtn pressed');
            }
        }
    };
    option = {
        ...defaultOption,
        ...option,
        confirm: {
            ...defaultOption.confirm,
            ...option.confirm,
            true: {
                ...defaultOption.confirm.true,
                ...(option.confirm?.true || {})
            },
            false: {
                ...defaultOption.confirm.false,
                ...(option.confirm?.false || {})
            }
        },
        callbacks: {
            ...defaultOption.callbacks,
            ...option.callbacks
        }
    };

    console.log(
        'title: ', title, '\n',
        'body: ', body, '\n',
        'animation: ', animation, '\n',
        'option: ', option
    );

    return new Promise((resolve) => {

        let popupOverlay = $('<div>', { id: 'FILPopupOverlay' });
        let popupArea = $('<div>', { id: 'FILPopupArea' }).appendTo(popupOverlay);

        // タイトル
        $('<div>', { id: 'FILPopupTitle' })
            .text(title.text)
            .css({
                backgroundColor: title.backgroundColor,
                fontSize: title.size,
                color: title.textColor
            })
            .appendTo(popupArea);

        // 本文
        const bodyDiv = $('<div>', { id: 'FILPopupBody' })
            .css({
                textAlign: body.centerAligning ? 'center' : 'left',
                fontSize: body.size,
                backgroundColor: body.backgroundColor,
                'border-radius': option.confirm.isConfirm ? '0' : '0 0 15px 15px'
            })
            .appendTo(popupArea);

        if (body.isHtml) bodyDiv.html(body.text);
        else bodyDiv.text(body.text);

        // 閉じる(X)ボタン
        $('<div>', { id: 'FILPopupCloseBtn' })
            .text('X')
            .on('click', async () => {
                option.callbacks.onCancel?.();
                await closePopup(option.confirm.isConfirm ? false : undefined);
            })
            .appendTo(popupArea);

        popupArea.css({
            opacity: 0,
            transform: getEnterTransform(animation.enter)
        });

        // confirm ボタン
        if (option.confirm.isConfirm) {
            let popupConfirm = $('<div>', { id: 'FILPopupConfirm' }).appendTo(popupArea);

            // OK ボタン
            $('<div>', { id: 'FILPopupConfirmTrueBtn' })
                .text(option.confirm.true.text)
                .css({
                    backgroundColor: option.confirm.true.backgroundColor,
                    color: option.confirm.true.textColor
                })
                .on('click', async () => {
                    option.callbacks.onConfirm?.();
                    await closePopup(true);
                })
                .appendTo(popupConfirm);

            // Cancel ボタン
            $('<div>', { id: 'FILPopupConfirmFalseBtn' })
                .text(option.confirm.false.text)
                .css({
                    backgroundColor: option.confirm.false.backgroundColor,
                    color: option.confirm.false.textColor
                })
                .on('click', async () => {
                    option.callbacks.onCancel?.();
                    await closePopup(false);
                })
                .appendTo(popupConfirm);
        }

        popupOverlay.appendTo('body');

        setTimeout(() => {
            popupOverlay.css({ backgroundColor: 'rgba(0,0,0,0.6)' });
            popupArea.css({
                opacity: 1,
                transform: 'translate(0,0) scale(1)'
            });
            option.callbacks.onOpen?.({
                overlay: popupOverlay,
                area: popupArea
            });
        }, 10);

        // 閉じるアニメーション + resolve をまとめて処理
        async function closePopup(result) {
            option.callbacks.onClose?.(result);
            popupArea.css({
                opacity: 0,
                transform: getLeaveTransform(animation.leave)
            });
            popupOverlay.css({
                backgroundColor: 'rgba(0,0,0,0)'
            });

            await delay(300);
            popupOverlay.remove();
            resolve(result);
        }

    });
    
    function getEnterTransform(type) {
        switch (type) {
            case 1: return 'translateY(-50px) scale(1)';
            case 2: return 'translateY(50px) scale(1)';
            case 3: return 'translateX(-50px) scale(1)';
            case 4: return 'translateX(50px) scale(1)';
            default: return 'scale(0.8)';
        }
    }

    function getLeaveTransform(type) {
        switch (type) {
            case 1: return 'translateY(-50px) scale(1)';
            case 2: return 'translateY(50px) scale(1)';
            case 3: return 'translateX(-50px) scale(1)';
            case 4: return 'translateX(50px) scale(1)';
            default: return 'scale(0.8)';
        }
    }
}


async function createSnackBar(
    text = 'this is a test',
    textColor = '#fff',
    backgroundColor = '#000',
    position = {
        vertical: 'start',
        horizontal: 'end'
    },
    direction = 'right',
    disappearTime = '10000'
) {
    position = Object.assign(
        {
            vertical: 'start',
            horizontal: 'end'
        },
        position
    );

    console.log(text, '\n', textColor, '\n', backgroundColor, '\n', position, '\n', direction, '\n', disappearTime);

    // 🔧 修正: 初期位置とアニメーション用の変形を取得
    const initialPositionCss = getPositionCss(position);
    const directionTransform = getDirectionTransform(direction);
    
    // 🔧 修正: 初期状態でdirectionのtransformと位置を両方適用
    let snackBox = $('<div>', {id: 'FILSnackBox'})
        .css({
            backgroundColor: backgroundColor,
            opacity: 0,
            ...initialPositionCss,
            transform: combineTransforms(initialPositionCss.transform, directionTransform)
        });
    
    $('<div>', {id: 'FILSnackText'})
        .text(text)
        .css({
            color: textColor,
        })
        .appendTo(snackBox);

    snackBox.appendTo('body');
    
    // 🔧 修正: DOM追加後に確実に初期状態を適用してからアニメーション開始
    await delay(50);
    
    snackBox.css({
        opacity: 1,
        transform: initialPositionCss.transform || 'translate(0, 0)'
    });

    // 指定時間後に非表示アニメーション
    await delay(parseInt(disappearTime));

    snackBox.css({
        opacity: 0,
        transform: combineTransforms(initialPositionCss.transform, directionTransform)
    });
    
    await delay(500);
    snackBox.remove();

    // 🔧 修正: transformを結合する関数を追加
    function combineTransforms(baseTransform, additionalTransform) {
        if (!baseTransform) return additionalTransform;
        return baseTransform + ' ' + additionalTransform;
    }

    function getPositionCss(position) {
        let css = {};
        let transforms = [];
        
        // 🔧 修正: 競合するプロパティをリセット
        switch (position.vertical) {
            case 'start':
                css.top = '0';
                css.bottom = 'auto';
                break;
            case 'center':
                css.top = '50%';
                css.bottom = 'auto';
                transforms.push('translateY(-50%)');
                break;
            case 'end':
                css.top = 'auto';
                css.bottom = '0';
                break;
        }
        
        switch (position.horizontal) {
            case 'start':
                css.left = '0';
                css.right = 'auto';
                break;
            case 'center':
                css.left = '50%';
                css.right = 'auto';
                transforms.push('translateX(-50%)');
                break;
            case 'end':
                css.left = 'auto';
                css.right = '0';
                break;
        }
        
        // 🔧 修正: transformが複数ある場合は結合
        if (transforms.length > 0) {
            css.transform = transforms.join(' ');
        }
        
        console.log(css);
        return css;
    }
    
    function getDirectionTransform(direction) {
        switch (direction) {
            case 'up': return 'translateY(-50px)';
            case 'down': return 'translateY(50px)';
            case 'left': return 'translateX(-50px)';
            case 'right': return 'translateX(50px)';
            default: return 'translateY(0)';
        }
    }
}


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export { createPopup, createSnackBar };