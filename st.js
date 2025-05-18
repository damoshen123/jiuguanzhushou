

'use strict';

(function () {


    const EventType = {
        GENERATE_IMAGE_REQUEST: 'generate_image_request',
        GENERATE_IMAGE_RESPONSE: 'generate_image_response'
    };
    

        eventOn(EventType.GENERATE_IMAGE_REQUEST, async function(requestData) {
            // 记录接收到的请求
            console.log(`接收到生图请求 (ID: ${requestData.id})`, 'info');
            console.log(requestData);

            try {
                // 将请求存储到localStorage
                const storageKey = `generate_image_request_${requestData.id}`;
                localStorage.setItem(storageKey, JSON.stringify(requestData));
                console.log(`请求已存储到localStorage: ${storageKey}`);
                
                // 模拟等待外部处理（在实际应用中，这里应该是监听localStorage变化）
                await checkForResponse(requestData.id);
            } catch (error) {
                console.log(`处理请求失败: ${error.message}`, 'error');
                
                // 发送错误响应
                await eventEmit(EventType.GENERATE_IMAGE_RESPONSE, {
                    id: requestData.id,
                    success: false,
                    error: error.message
                });
            }
        });
        
        // 检查是否有响应
        async function checkForResponse(requestId) {
            return new Promise((resolve) => {
                // 创建存储事件监听器
                const storageListener = function(e) {
                    // 检查是否是对应请求的响应
                    const responseKey = `generate_image_response_${requestId}`;
                    if (e.key === responseKey) {
                        try {
                            const responseData = JSON.parse(e.newValue);
                            console.log(`从localStorage获取到响应: ${responseKey}`);
                            
                            // 发送响应事件
                            eventEmit(EventType.GENERATE_IMAGE_RESPONSE, {
                                id: requestId,
                                success: true,
                                imageData: responseData.imageData
                            });
                            // 清理
                            window.removeEventListener('storage', storageListener);
                            localStorage.removeItem('generate_image_request_'+requestId);
                            localStorage.removeItem('generate_image_response_'+requestId);
                            resolve();
                        } catch (error) {
                            console.log(`解析响应失败: ${error.message}`, 'error');
                            
                            // 发送错误响应
                            eventEmit(EventType.GENERATE_IMAGE_RESPONSE, {
                                id: requestId,
                                success: false,
                                error: '解析响应失败'
                            });
                            
                            // 清理
                            window.removeEventListener('storage', storageListener);
                            localStorage.removeItem('generate_image_request_'+requestId);
                            localStorage.removeItem('generate_image_response_'+requestId);
                            resolve();
                        }
                    }
                };
                // 添加存储事件监听器
                window.addEventListener('storage', storageListener);
            });
        }
        console.log("准备好接收请求");




let intervalId = setInterval(() => {  extractImageTags().then(result => {
        console.log('所有提取的图片标签内容:', result.allImageTags);
        console.log('每个AI消息的图片标签详情:', result.messageDetails);
        
async function insertImageTagsBelow() {
    const result = await extractImageTags(); // Extract image tags and message details
    const messageDetails = result.messageDetails;
    console.log('messageDetails:', messageDetails);
    const storageKey = `messageDetails`+generateUniqueId();
    localStorage.setItem(storageKey, JSON.stringify(messageDetails));
    console.log(`请求已存储到localStorage: ${storageKey}`);
}

// Insert new divs after extracting image tags
insertImageTagsBelow(); 

    }).catch((error) => {
        console.error('错误:', error);
    });}, 3000);

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}


// 从AI楼层获取消息并提取图片标签内容
async function extractImageTags() {
    // 获取所有消息
    const chatMessages = await getChatMessages('0-{{lastMessageId}}', { 
        role: 'assistant',  // 只获取AI角色的消息
        include_swipes: false 
    });
    console.log(chatMessages);
    
    const imageTags = [];
    const messageDetails = [];

    // 遍历每个AI消息
    chatMessages.forEach(message => {
        const matches = message.message.match(/<image>([\s\S]*)<\/image>/g);
        if (matches) {
            // 提取图片标签内容并添加到结果数组
            const extractedTags = matches.map(tag => tag.replace(/<\/?image>/g, ''));
            imageTags.push(...extractedTags);
            
            // 记录消息ID和对应的图片标签内容
            messageDetails.push({
                message_id: message.message_id,
                name: message.name,
                imageTags: extractedTags
            });
        }
    });

    // 返回提取结果
    return {
        allImageTags: imageTags,
        messageDetails: messageDetails
    };
}

    // 调用函数并记录提取的图片内容
  

})();
