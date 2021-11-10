const storageLocal = {
    save: (e, t, o) => {
        let a = {};
        a[e] = JSON.stringify(t), chrome.storage.local.set(a, o)
    },
    load: (e, t, o) => {
        let a = {};
        a[e] = JSON.stringify(t), chrome.storage.local.get(a, t => {
            let a = {};
            a[e] = JSON.parse(t[e]), o(a)
        })
    }
};