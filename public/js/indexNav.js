function scrollPages(direction) {
    const container = document.getElementById('paginationContainer');
    
    
    const scrollAmount = 10 * direction; 
    
    
    console.log('Scrolling direction: ', direction);
    console.log('Current scroll position: ', container.scrollLeft);

    
    container.scrollBy({
        left: scrollAmount, 
        behavior: 'smooth'
    });

    
    console.log('New scroll position: ', container.scrollLeft);
}