function toggle(button){
    // Remove "selected-button" class from all buttons
    var buttons = document.querySelectorAll('.btn');
    buttons.forEach(function(btn) {
      btn.classList.remove('selected-button');
    });
  
    // Add "selected-button" class to the clicked button
    button.classList.add('selected-button');

    button.blur();
  }