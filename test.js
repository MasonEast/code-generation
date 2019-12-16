const fs = require('fs');
// const fse = require('fs-extra')
const path = require('path');
// const React = require('react')
// const { Button } = require('antd');

const localPath = process.cwd();

const arr = [
    { text: 'aa', type: 'primary' },
    { text: 'BB', type: 'dashed' },
    { text: 'dd', type: 'danger' },
    { text: 'GG', type: 'link' },
]

const createHeader = (() => {
    return `<div>
        ${
        arr.map((btn, i) => {
            return `<Button key={${i}} type={'${btn.type}'}>${btn.text}</Button>`
        }).join(',').replace(/,/g, '\n')
        }
    </div>`
})()
console.log(createHeader)

fs.writeFile(path.join(localPath, 'btn.js'), createHeader, (err) => {
    if (err) {
        console.log(err)
        return;
    }
    console.log('success!')
})