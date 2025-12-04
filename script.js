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
        'title: ', title,'\n',
        'body: ',body,'\n',
        'animation: ',animation,'\n',
        'option: ',option
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
        $('<div>', { id: 'FILPopupBody' })
            .text(body.text)
            .css({
                textAlign: body.centerAligning ? 'center' : 'left',
                fontSize: body.size,
                color: body.textColor,
                backgroundColor: body.backgroundColor,
                'border-radius': option.confirm.isConfirm ? '0' : '0 0 15px 15px' 
            })
            .appendTo(popupArea);

        // 閉じる(X)ボタン
        $('<div>', { id: 'FILPopupCloseBtn' })
            .text('X')
            .on('click', async () => {
                option.callbacks.onCancel?.();
                await closePopup(option.confirm.isConfirm ? false : undefined); // false として返す
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
                    await closePopup(true); // true を返す
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
                    await closePopup(false); // false を返す
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
                ares: popupArea
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
}


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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export { createPopup };