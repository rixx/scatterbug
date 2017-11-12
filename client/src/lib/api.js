import config from 'config'
const api = {
    saveIssue(org, project, id, x, y, token) {
        return fetch(
            `${config.url}/${org}/${project}/issues/${id}/${token}`,
            {method: 'POST', body: JSON.stringify({x, y})}
        )
    },
    getIssues(org, project, token) {
        return fetch(`${config.url}/${org}/${project}/issues/${token}`).then((response) => {
            return response.json()
    })
    },
}

export default api
