(function () {
    const dbName = 'onetab'
    const storeName = 'item'

    const request = indexedDB.open(dbName)

    request.onerror = function (event) {
        console.error("无法打开数据库:", event)
    }

    request.onsuccess = function (event) {
        const db = event.target.result

        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`数据库中未找到名为【${storeName}】的表`)
            return
        }

        const transaction = db.transaction([storeName], "readonly")
        const objectStore = transaction.objectStore(storeName)

        const getAllRequest = objectStore.getAll()
        const getAllKeysRequest = objectStore.getAllKeys()

        transaction.oncomplete = function () {
            const data = getAllRequest.result
            const keys = getAllKeysRequest.result

            const finalDump = {}

            keys.forEach((key, index) => {
                finalDump[key] = data[index]
            })

            const json = JSON.stringify(finalDump, null, 2)

            // 导出下载
            const blob = new Blob([json], {
                type: 'application/json'
            })

            const url = URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = `${dbName}_${storeName}.json`
            a.click()

            URL.revokeObjectURL(url)

            console.log(`成功导出 ${keys.length} 条数据`)
        }
    }
})()