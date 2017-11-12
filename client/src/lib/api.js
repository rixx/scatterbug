const api = {
    saveIssue(org, project, id, x, y) {
        return fetch(
            `http://localhost:8080/${org}/${project}/issues/${id}`,
            {method: 'POST', body: JSON.stringify({x, y})}
        )
    },
    getIssues(org, project) {
        return fetch(`http://localhost:8080/${org}/${project}/issues`).then((response) => {
            return response.json()
    })
    },
}

export default api
