const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.bottom >= 0;
}

const relativeTime = (current, previous) => {

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
  
    var elapsed = current - previous;
  
    if (elapsed < msPerMinute) {
         return (Math.round(elapsed/1000) > 1) ? 'Updated ' + Math.round(elapsed/1000) + 'seconds ago' : 'Updated ' + Math.round(elapsed/1000) + 'second ago'; 
    
    }
    else if (elapsed < msPerHour) {
         return (Math.round(elapsed/msPerMinute) > 1) ? 'Updated ' + Math.round(elapsed/msPerMinute) + ' minutes ago' : 'Updated ' + Math.round(elapsed/msPerMinute) + ' minute ago';   
    }
    else if (elapsed < msPerDay ) {
         return (Math.round(elapsed/msPerHour) > 1) ? 'Updated ' + Math.round(elapsed/msPerHour ) + ' hours ago' : 'Updated ' + Math.round(elapsed/msPerHour ) + ' hour ago';   
    }
    else if (elapsed < msPerMonth) {
        return (Math.round(elapsed/msPerDay) > 1) ? 'Updated ' + Math.round(elapsed/msPerDay) + ' days ago' : 'Updated yesterday';   
    }
    else if (elapsed >= msPerMonth) {
      return `Updated on ${months[previous.getUTCMonth()]} ${previous.getUTCDate()}`  
    }
  }

  const appendChildFunc = (parent, children) => {
    for (let i = 0; i < children.length; i++) {
      parent.appendChild(children[i])
    }
  }