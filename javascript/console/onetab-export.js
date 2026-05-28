(function () {
    const dbName = 'onetab'
    const storeName = 'item' // 真正存数据的表
    const request = indexedDB.open(dbName)

    request.onerror = function (event) {
        console.error("无法打开数据库:", event)
    }

    request.onsuccess = function (event) {
        const db = event.target.result

        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`数据库中未找到名为 【${storeName}】 的表！`)
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

            const formattedData = JSON.stringify(finalDump, null, 2)

            console.log(`("=========== 成功从 item 表中发现 ${keys.length} 条数据 ===========");`)
            console.log(formattedData)
            console.log("================================================================")
        }
    }
})()
