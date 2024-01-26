const debounce = <T>(
    func: (...args: T[]) => unknown,
    waitMillis = 500
): typeof func => {
    let timer: NodeJS.Timeout | null = null;
    return function (...args: T[]) {
        // @ts-expect-error: preventing
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            func.apply(context, args);
        }, waitMillis);
    };
};

export default debounce;
