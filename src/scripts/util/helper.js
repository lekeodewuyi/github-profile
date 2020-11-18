const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.bottom >= 0;
}