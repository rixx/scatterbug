const api = {
    getIssues(org, project) {
        return fetch(`https://api.github.com/repos/${org}/${project}/issues?state=open&per_page=150`).then((response) => {
            return response.json()
    })
    },
}

export default api
