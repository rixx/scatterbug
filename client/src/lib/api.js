import config from 'config'
const api = {
    saveIssue(org, project, id, x, y) {
        return fetch(
            `${config.url}/${org}/${project}/issues/${id}`,
            {method: 'POST', body: JSON.stringify({x, y})}
        )
    },
    getIssues(org, project) {
        return fetch(`${config.url}/${org}/${project}/issues`).then((response) => {
            return response.json()
    })
    },
}

export default api
