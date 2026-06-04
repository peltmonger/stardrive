import { visit } from 'unist-util-visit';
import type { RehypePlugin } from '@astrojs/markdown-remark';
import type { Root } from 'hast';

const URL_PATTERN = /^(?:https?:\/\/)?(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)(?:&t=([\w-]+))?(?:&list=([\w-]+))?(?:&title=([^&]*))?$/;
// scheme: youtube.com/watch?v=VIDEO_ID&t=TIME&list=PLAYLIST_ID&title=TITLE with t and list being optional

export const rehypeYoutubePlugin: RehypePlugin = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName != 'p' || node.children.length !== 1 || node.children[0].type != 'text') {
        return;
      }

      const textContent = node.children[0].value;
      const match = textContent.match(URL_PATTERN);
      const videoId = match && match[1] ? match[1] : null;
      const time = match && match[2] ? '&amp;start=' + match[2].replace(/s$/, '') : '';
      const list = match && match[3] ? '&amp;listType=playlist&amp;list=' + match[3] : '';
      const title = match && match[4] ? match[4] : null;

      if (!videoId) return;

      // Replace YouTube component with iframe
      node.tagName = 'div';
      node.properties = { class: 'video-container' };
      node.children = [
        {
          type: 'element',
          tagName: 'iframe',
          properties: {
            class: 'video-embed',
            width: '560',
            height: '315',
            src: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0${time}${list}`,
            title: title ?? 'YouTube video player',
            frameBorder: '0',
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
            allowFullscreen: true,
          },
          children: [],
        },
      ];
    });
  };
};
