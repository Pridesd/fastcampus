import htmlTemplate from 'rollup-plugin-generate-html-template';
import scss from 'rollup-plugin-scss';
import {nodeResolve} from '@rollup/plugin-node-resolve'; //또다른 라이브러리를 사용할 수 있게 돕는 플러그인
export default {
    input: 'src/js/index.js',
    output:{
        file: './dist/bundle.js',
        format: 'cjs',
        sourcemap: true
    },
    plugins:[
        nodeResolve(),
        scss({
            insert: true, //scss를 index.js릍 통해 임포트 해서 동적으로 헤드쪽에 넣음
            sourceMap: true
        }),
        htmlTemplate({
            template: 'src/index.html',
            target: 'index.html'
        })
    ]
}