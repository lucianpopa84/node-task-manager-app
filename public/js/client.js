const deleteTask = async (id) => {
    await fetch(`/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    location.reload();
};

const toggleTask = async (id, completed) => {
    await fetch(`/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            completed: !completed
        }) 
    });
};

const updateTask = async (id, input) => {
    const description = input.value;
    await fetch(`/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description
        }) 
    });
};