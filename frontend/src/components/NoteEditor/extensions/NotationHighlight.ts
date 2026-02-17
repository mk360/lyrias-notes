import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

interface NotationHighlightOptions {
  colors: {
    light: string;
    medium: string;
    heavy: string;
    ultimate: string;
    skill: string;
  };
}

interface NotationMatch {
  from: number;
  to: number;
  color: string;
}

const NotationHighlight = Extension.create<NotationHighlightOptions>({
  name: 'notationHighlight',

  addOptions() {
    return {
      colors: {
        light: '#DE7CD1',
        medium: '#16df53',
        heavy: '#ff6b6b',
        ultimate: '#1ba6ff',
        skill: '#ffe370',
      },
    };
  },

  addProseMirrorPlugins() {
    const { colors } = this.options;

    return [
      new Plugin({
        key: new PluginKey('notationHighlight'),
        state: {
          init: (_, { doc }) => findNotations(doc, colors),
          apply: (transaction, oldState) => {
            if (transaction.docChanged) {
              return findNotations(transaction.doc, colors);
            }
            return oldState.map(transaction.mapping, transaction.doc);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

function findNotations(doc: any, colors: NotationHighlightOptions['colors']): DecorationSet {
  const decorations: Decoration[] = [];
  const text = doc.textContent;

  // Regex patterns for different notation types
  const patterns = [
    // Complex patterns with modifiers and directionals
    // Examples: j.236M, c.HXX, [4]6U, 236S+U
    {
      regex: /((?:j\.|c\.|f\.)?(?:236236|214214|632146|236S|214S|236|214|623|\[4\]6|\[2\]8|22|5S|6S|4S|2S)(?:\+)?[LMHUS])/g,
      getColor: (match: string) => {
        // For 236S+U pattern, color based on the suffix after +
        if (match.includes('+')) {
          const suffix = match.split('+')[1];
          if (suffix === 'L') return colors.light;
          if (suffix === 'M') return colors.medium;
          if (suffix === 'H') return colors.heavy;
          if (suffix === 'U') return colors.ultimate;
          if (suffix === 'S') return colors.skill;
        }
        
        // For skill patterns (ends with S but not after +)
        if (match.endsWith('S') && !match.includes('+')) {
          return colors.skill;
        }
        
        // Regular button coloring
        if (match.endsWith('L')) return colors.light;
        if (match.endsWith('M')) return colors.medium;
        if (match.endsWith('H')) return colors.heavy;
        if (match.endsWith('U')) return colors.ultimate;
        
        return null;
      },
    },
    // Proximity normals with modifiers (c.M, f.H, etc.)
    {
      regex: /\b((?:c\.|f\.)[LMHUS](?:XX)?)\b/g,
      getColor: (match: string) => {
        if (match.includes('L')) return colors.light;
        if (match.includes('M')) return colors.medium;
        if (match.includes('H')) return colors.heavy;
        if (match.includes('U')) return colors.ultimate;
        if (match.includes('S')) return colors.skill;
        return null;
      },
    },
    // Simple directional + button (5L, 2M, etc.) - but NOT standalone buttons
    {
      regex: /\b([2456][LMHUS])\b/g,
      getColor: (match: string) => {
        if (match.endsWith('L')) return colors.light;
        if (match.endsWith('M')) return colors.medium;
        if (match.endsWith('H')) return colors.heavy;
        if (match.endsWith('U')) return colors.ultimate;
        if (match.endsWith('S')) return colors.skill;
        return null;
      },
    },
    // Multi-button combinations (M+H, L+M+H) - color each separately
    {
      regex: /\b([LMHUS]\+[LMHUS](?:\+[LMHUS])*)\b/g,
      getColor: null, // Special handling below
      isMultiButton: true,
    },
  ];

  let currentPos = 0;
  doc.descendants((node: any, pos: number) => {
    if (!node.isText) {
      currentPos += node.nodeSize;
      return;
    }

    const nodeText = node.text || '';

    patterns.forEach((pattern) => {
      let match;
      pattern.regex.lastIndex = 0; // Reset regex

      while ((match = pattern.regex.exec(nodeText)) !== null) {
        const from = pos + match.index;
        const to = from + match[0].length;

        if (pattern.isMultiButton) {
          // Handle multi-button combinations - color each button separately
          const buttons = match[0].split('+');
          let offset = 0;
          buttons.forEach((button, idx) => {
            const buttonFrom = from + offset;
            const buttonTo = buttonFrom + button.length;
            
            let buttonColor = null;
            if (button === 'L') buttonColor = colors.light;
            else if (button === 'M') buttonColor = colors.medium;
            else if (button === 'H') buttonColor = colors.heavy;
            else if (button === 'U') buttonColor = colors.ultimate;
            else if (button === 'S') buttonColor = colors.skill;

            if (buttonColor) {
              decorations.push(
                Decoration.inline(buttonFrom, buttonTo, {
                  style: `color: ${buttonColor}; font-weight: bold;`,
                })
              );
            }

            offset += button.length;
            if (idx < buttons.length - 1) {
              offset += 1; // Account for the '+' character
            }
          });
        } else {
          const color = pattern.getColor ? pattern.getColor(match[0]) : null;
          if (color) {
            decorations.push(
              Decoration.inline(from, to, {
                style: `color: ${color}; font-weight: bold;`,
              })
            );
          }
        }
      }
    });

    currentPos += node.nodeSize;
  });

  return DecorationSet.create(doc, decorations);
}

export default NotationHighlight;
