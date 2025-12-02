function createPopup(
    meta = { title: "", body: "" },
    enterType = 0,
    leaveType = 0,
    titleBackgroundColor = '#c4c4ff',
    titleSize = '24px',
    bodyCenterAligning = true
) {
    let popupOverlay = $('<div>', { id: 'FILPopupOverlay' });
    let popupArea = $('<div>', { id: 'FILPopupArea' }).appendTo(popupOverlay);

    $('<div>', { id: 'FILPopupTitle' })
        .text(meta.title)
        .css({
            backgroundColor: titleBackgroundColor,
            fontSize: titleSize
        })
        .appendTo(popupArea);

    $('<div>', { id: 'FILPopupBody' })
        .text(meta.body)
        .css({ textAlign: bodyCenterAligning ? 'center' : 'left' })
        .appendTo(popupArea);

    $('<div>', { id: 'FILPopupCloseBtn' })
        .text('X')
        .on('click', async () => {
            popupArea.css({
                opacity: 0,
                transform: getLeaveTransform(leaveType)
            });
            popupOverlay.css({
                backgroundColor: 'rgba(0,0,0,0)'
            });

            await delay(400);
            popupOverlay.remove();
            $(document).off('keydown');
        })
        .appendTo(popupArea);

    popupArea.css({
        opacity: 0,
        transform: getEnterTransform(enterType)
    });

    popupOverlay.appendTo('body');

    setTimeout(() => {
        popupOverlay.css({ backgroundColor: 'rgba(0,0,0,0.6)' });
        popupArea.css({
            opacity: 1,
            transform: 'translate(0,0) scale(1)'
        });
    }, 10);

    $(document).on('keydown', e => {
        if (e = 'Escape') {
            $('#FILPopupCloseBtn').click();
        }
    })
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