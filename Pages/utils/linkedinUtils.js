export async function GetName( urnValue, token ) {
    return new Promise(async (resolve, reject) => {
        let URL = `https://api.linkedin.com/v2/organizations/${urnValue}`;
        try{
            let t = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (t.status != 200) throw 'error'
            let p = await t.json();
            resolve(p["vanityName"]);
        } catch(e) {
            reject(e)
        }
    })
}

export async function GetPersonalURN ( token ) {
    return new Promise (async (resolve, reject) => {
        let URL = `https://api.linkedin.com/v2/me`
        try {
            let payload = await fetch(URL,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            if (payload.status != 200) throw 'error'
            let payload_object = await payload.json()
            let id = 'urn:li:person:' + payload_object.id
            resolve(id)
        } catch(e) {
            reject(e)
        }
    })
}

export async function GetOrganizationUserManages(  token ) {
    return new Promise(async (resolve, reject) => {
            let URL = `https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee`
            try {
                let payload = await fetch(URL,{
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                })
                if (payload.status != 200) throw 'error'
                let payload_object = await payload.json()
                let array_of_orgs = [];
                for (let v of payload_object["elements"]) {

                    let value = v['organizationalTarget']
                    let parts = value.split(":")
                    if (parts[2] != 'organization') continue;
                    let name = await GetName(parts[3], token)
                    array_of_orgs.push({
                        urn: value,
                        name: name,
                    })
                }
                resolve(array_of_orgs)
            } catch (e) {
                reject(e)
            }
        }
    )
}
