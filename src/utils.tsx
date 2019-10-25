
export function loadMore(container: HTMLElement, getMore: any) {
    function _loadMore() {
        console.log(container.scrollTop);
        let clientHeight = container.clientHeight;
        let scrollTop = container.scrollTop;
        let scrollHeight = container.scrollHeight;
        if (clientHeight + scrollTop + 5 >= scrollHeight) {
            getMore();
        }
    }
    container.addEventListener('scroll', debounce(_loadMore, 300));
}

export function downRefresh(container: HTMLElement, refreshFn: any) {
    let startY: number;//起始的位置
    let distance: number;//下拉的距离
    let originTop = container.offsetTop;//记录一下此元素原始top值 50px
    container.addEventListener('touchstart', function (event: any) {
        let touchMove = throttle(_touchMove, 70);
        if (container.offsetTop === originTop && container.scrollTop == 0) {
            startY = event.touches[0].pageY;//起始的位置
            container.addEventListener('touchmove', touchMove);
            container.addEventListener('touchend', touchEnd);
        }
        function _touchMove(event: any) {
            let pageY = event.touches[0].pageY;
            if (pageY > startY) {//如果说新的Y值大于旧的Y值的话说明下拉
                distance = pageY - startY;
                container.style.top = originTop + distance + 'px';
            } else {
                container.removeEventListener('touchmove', touchMove);
                container.removeEventListener('touchend', touchEnd);
            }
        }
        function touchEnd(event: any) {
            container.removeEventListener('touchmove', touchMove);
            container.removeEventListener('touchend', touchEnd);
            if (distance > 10) {
                refreshFn();
            }
            let timer = setInterval(function () {
                if (distance < 1) {
                    container.style.top = originTop + 'px';
                    clearInterval(timer);
                } else {
                    container.style.top = originTop + (--distance) + 'px';
                }
            }, 13);

        }

    });
}
//debounce
function debounce(fn: any, wait: number): any {
    let timeout: any = null;
    return function () {
        if (timeout != null) clearTimeout(timeout);
        timeout = setTimeout(fn, wait);
    }
}
//原来是3毫秒 现在30毫秒执行一次

function throttle(func: any, delay: number) {
    let prev = Date.now();
    return function () {
        let context = this;
        let args = Array.from(arguments);
        let now = Date.now();
        if (now - prev >= delay) {
            func.apply(context, args);
            prev = now;
        }
    }
}
