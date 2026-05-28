(function () {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.style.display = 'none'
    document.body.appendChild(input)

    input.onchange = function (event) {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result)
                console.log(`成功读取文件，检测到共 ${Object.keys(data).length} 个数据项，准备写入数据库...`)
                writeDataToIndexedDB(data)
            } catch (err) {
                console.error("文件解析失败:", err)
            }
        }
        reader.readAsText(file)
    }

    function writeDataToIndexedDB(data) {
        const dbName = 'onetab'
        const storeName = 'item'
        const request = indexedDB.open(dbName)

        request.onsuccess = function (event) {
            const db = event.target.result

            if (!db.objectStoreNames.contains(storeName)) {
                console.error(`未找到 【${storeName}】 表，请先在目标 OneTab 页面随便存一个标签。`)
                return
            }

            const transaction = db.transaction([storeName], "readwrite")
            const objectStore = transaction.objectStore(storeName)

            let successCount = 0
            const keys = Object.keys(data)

            keys.forEach(key => {
                // 因为使用了内联主键，put 只需要传入包含 id 的数据对象即可，不能带第二个参数
                const putRequest = objectStore.put(data[key])

                putRequest.onsuccess = function () {
                    successCount++
                }
                putRequest.onerror = function (e) {
                    console.error(`写入单条数据失败 (Key: ${key}):`, e.target.error)
                }
            })

            transaction.oncomplete = function () {
                console.log(`已成功将 ${successCount}/${keys.length} 条数据注入 item 表！`)
                console.log("请刷新 OneTab 页面，检查目录和网页是否已经导入。")
                document.body.removeChild(input)
            }

            transaction.onerror = function (event) {
                console.error("批量写入事务失败:", event)
                document.body.removeChild(input)
            }
        }
    }

    input.click()
})()
