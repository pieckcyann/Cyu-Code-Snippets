// ！暂不可用
(function () {
    // 弹窗二次确认，防止手抖误删
    const confirmClear = confirm("⚠️ 警告：这将彻底清空 OneTab 中所有的网页列表、分组、目录结构且不可逆！确定要重置吗？")
    if (!confirmClear) {
        console.log("❌ 操作已取消，数据完好无损。")
        return
    }

    const dbName = 'onetab'
    const storeName = 'item' // 锁定存放数据的核心表
    const request = indexedDB.open(dbName)

    request.onsuccess = function (event) {
        const db = event.target.result

        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`❌ 未找到 【${storeName}】 表，无需重置。`)
            return
        }

        // 开启读写事务
        const transaction = db.transaction([storeName], "readwrite")
        const objectStore = transaction.objectStore(storeName)

        // 🛠️ 核心操作：直接清空整张表
        const clearRequest = objectStore.clear()

        clearRequest.onsuccess = function () {
            console.log(`🧹 正在擦除【${storeName}】表中的所有数据...`)
        }

        transaction.oncomplete = function () {
            console.log("✨【彻底重置成功】OneTab 数据表已被完全清空！")
            console.log("💡 现在刷新 OneTab 页面，它将变回一个没有任何标签的干净状态。你可以重新导入干净的数据了。")
        }

        transaction.onerror = function (event) {
            console.error("❌ 重置失败，事务中途遭遇错误:", event)
        }
    }

    request.onerror = function (e) {
        console.error("❌ 无法打开数据库以执行重置:", e)
    }
})()