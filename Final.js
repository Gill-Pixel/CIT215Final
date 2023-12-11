let wantedArray = [];
let selectedObject = null;

function fetchWantedList() {
    $.ajax({
        url: 'https://api.fbi.gov/wanted/v1/list',
        method: 'GET',
        success: function(data) {
            wantedArray = data.items;
            displayWantedList();
        },
        error: function(error) {
            console.error('Error fetching wanted list:', error);
        }
    });
}

function displayWantedList() {
    const $wantedList = $('#wantedList');
    $wantedList.empty();

    wantedArray.forEach(item => {
        const $li = $('<li>').addClass('wanted-card');
        const $image = $('<img>').addClass('wanted-image');
        
        // Check if item.images exists and has a length greater than 0
        if (item.images && item.images.length > 0) {
            $image.attr('src', item.images[0].large);
        }
        
        const $title = $('<h3>').text(item.title);
        $li.append($image, $title);
        $li.click(function() {
            displayDetails(item);
        });
        $wantedList.append($li);
    });
    
}

function displayDetails(item) {
    selectedObject = item;
    const $details = $('#details');
    $details.empty();

    const $title = $('<h2>').text(item.title);
    const $description = $('<p>').text(item.description);

    const $deleteButton = $('<button>').text('Delete').attr('id', 'deleteButton').click(function() {
        deleteObject(item);
    });

    const $updateButton = $('<button>').text('Update').attr('id', 'updateButton').click(function() {
        openUpdateModal(item);
    });

    $details.append($title, $description, $deleteButton, $updateButton);

    openModal();
}

function deleteObject(item) {
    const index = wantedArray.indexOf(item);
    if (index !== -1) {
        // Add fade-out animation
        $(`#wantedList li:eq(${index})`).addClass('fade-out');

        setTimeout(() => {
            wantedArray.splice(index, 1);
            displayWantedList();
            $('#details').empty();
        }, 500); // Delay for the same duration as the fade-out animation
    }
}

function openUpdateModal(item) {
    selectedObject = item;
    $('#titleInput').val(item.title);
    $('#descriptionInput').val(item.description);
    openModal();
}

function openCreateModal() {
    selectedObject = null;
    $('#titleInput').val('');
    $('#descriptionInput').val('');
    openModal();
}

function openModal() {
    $('#modal').show();
}

function closeModal() {
    $('#modal').hide();
}

function saveObject() {
    const title = $('#titleInput').val();
    const description = $('#descriptionInput').val();

    if (title && description) {
        const newItem = {
            title: title,
            description: description
        };

        // Add the new item to the array
        wantedArray.push(newItem);

        // Refresh the displayed list immediately with the fade-in animation
        const $newLi = $('<li>').addClass('wanted-card fade-in'); // Apply the fade-in class
        const $image = $('<img>').addClass('wanted-image');
        
        // Check if newItem.images exists and has a length greater than 0
        if (newItem.images && newItem.images.length > 0) {
            $image.attr('src', newItem.images[0].large);
        }
        
        const $title = $('<h3>').text(newItem.title);
        $newLi.append($image, $title);
        $newLi.click(function() {
            displayDetails(newItem);
        });
        
        // Append the new list item to the list
        $('#wantedList').append($newLi);

        // Close the modal
        closeModal();
    }
}



function updateObject() {
    const updatedTitle = $('#titleInput').val();
    const updatedDescription = $('#descriptionInput').val();

    if (selectedObject && updatedTitle && updatedDescription) {
        selectedObject.title = updatedTitle;
        selectedObject.description = updatedDescription;

        // Refresh the displayed list immediately
        displayWantedList();

        // Close the modal
        closeModal();
    }
}

$(document).ready(function() {
    fetchWantedList();

    $('#createObjectBtn').click(function() {
        openCreateModal();
    });

    $('#modalSaveBtn').click(function() {
        if (selectedObject) {
            updateObject();
        } else {
            saveObject();
        }
    });

    $('#modalCloseBtn').click(function() {
        closeModal();
    });
});
