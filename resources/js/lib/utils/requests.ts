

export const debounce = (fn: () => any, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn();
      }, wait);
    };
};
