import {
  typeForm,
  typeInput,
  // typeTextarea,
  // typeSelect,
  // typeCheckbox,
  // typeRadio,
  typeButton,
  typeLabel,
} from './components';

const blocks = (editor, opt) => {
  const opts = opt;
  const bm = editor.BlockManager;
  const addBlock = (id, def) => {
    opts.blocks?.indexOf(id) >= 0 && bm.add(id, {
      ...def,
      category: opts.category,
      select: true,
      ...opt.block(id),
    });
  }

  addBlock(typeForm, {
    // label: 'Form',
    media: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 266 150" fill="none">
      <defs>
        <clipPath id="clip0_3_77">
          <rect width="266" height="150" fill="white"/>
        </clipPath>
      </defs>
      <g clip-path="url(#clip0_3_77)">
        <path d="M -0.432 -0.58 L 265.568 -0.58 L 265.568 149.42 L -0.432 149.42 L -0.432 -0.58 Z" fill="white"/>
        <g style="" transform="matrix(1.264205, 0, 0, 1.268136, -29.454134, -13.876873)">
          <path d="M 188.964 30.241 C 188.964 28.242 185.893 26.91 180.983 26.91 L 74.786 26.91 C 69.875 26.91 66.805 28.242 66.805 30.241 L 66.805 50.226 C 66.805 52.225 69.875 53.557 74.786 53.557 L 181.604 53.557 C 186.515 53.557 189.573 52.225 189.573 50.226 L 189.573 30.241 L 188.964 30.241 Z M 182.822 46.895 L 72.337 46.895 L 72.337 33.571 L 182.822 33.571 L 182.822 46.895 Z M 188.964 63.55 C 188.964 61.552 185.893 60.219 180.983 60.219 L 74.786 60.219 C 69.875 60.219 66.805 61.552 66.805 63.55 L 66.805 83.535 C 66.805 85.535 69.875 86.867 74.786 86.867 L 181.604 86.867 C 186.515 86.867 189.573 85.535 189.573 83.535 L 189.573 63.55 L 188.964 63.55 Z M 182.822 80.205 L 72.337 80.205 L 72.337 66.881 L 182.822 66.881 L 182.822 80.205 Z" style="fill: rgb(99, 102, 241);"/>
          <rect width="63.015" height="20.023" x="66.18" y="93.654" rx="0.5" style="fill: rgb(99, 102, 241);"/>
        </g>
        <text style="fill: rgb(255, 255, 255); font-family: Arial, sans-serif; font-size: 7.7px; white-space: pre;" x="75.996" y="106.734" transform="matrix(3.035136, 0, 0, 2.715719, -165.265656, -164.853622)">Form</text>
      </g>
    </svg>
    `,
    content: {
      type: typeForm,
      components: [ {
          components: [
            { type: typeLabel, components: 'To Address' },
            { type: typeInput, value:'1', attributes: { type: 'text', name: '_to', required: true, placeholder: '0x Address to receive the mint' } },
          ]
        }, {
          components: [
            { type: typeLabel, components: 'Metadata JSON URL' },
            { type: typeInput, value:'2', attributes: { type: 'text', name: '_ipfsHash', required: true, placeholder: 'URL of the metadata file' } },
          ]
        }, {
          components: [{ type: typeButton, attributes: { type: 'submit' } }]
        },
      ]
    }
  });

  addBlock(typeInput, {
    // label: 'Input',
    media: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 266 150" fill="none">
    <defs>
      <clipPath id="clip0_3_77">
        <rect width="266" height="150" fill="white"/>
      </clipPath>
    </defs>
    <g clip-path="url(#clip0_3_77)">
      <path d="M -0.432 -0.58 L 265.568 -0.58 L 265.568 149.42 L -0.432 149.42 L -0.432 -0.58 Z" fill="white"/>
      <text style="fill: rgb(99, 102, 241); font-family: Arial, sans-serif; font-size: 7.7px; white-space: pre;" transform="matrix(3.582677, 0, 0, 3.41696, -171.515259, -242.949692)" x="75.996" y="106.734">Input</text>
      <rect x="51.29" y="54.784" width="160.644" height="35.57" style="stroke-width: 6px; stroke-linecap: round; stroke-linejoin: round; stroke: rgb(99, 102, 241);"/>
      <rect x="60.529" y="62.062" width="6.476" height="22.288" style="stroke: rgb(99, 102, 241); fill: rgb(99, 102, 241);"/>
    </g>
  </svg>
    `,
    content: { type: typeInput },
  });

  // addBlock(typeTextarea, {
  //   label: 'Textarea',
  //   media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 7.5c0-.9-.5-1.5-1.3-1.5H3.4C2.5 6 2 6.6 2 7.5v9c0 .9.5 1.5 1.3 1.5h17.4c.8 0 1.3-.6 1.3-1.5v-9zM21 17H3V7h18v10z"/><path d="M4 8h1v4H4zM19 7h1v10h-1zM20 8h1v1h-1zM20 15h1v1h-1z"/></svg>',
  //   content: { type: typeTextarea },
  // });

  // addBlock(typeSelect, {
  //   label: 'Select',
  //   media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 9c0-.6-.5-1-1.3-1H3.4C2.5 8 2 8.4 2 9v6c0 .6.5 1 1.3 1h17.4c.8 0 1.3-.4 1.3-1V9zm-1 6H3V9h18v6z"/><path d="M18.5 13l1.5-2h-3zM4 11.5h11v1H4z"/></svg>',
  //   content: { type: typeSelect },
  // });

  addBlock(typeButton, {
    // label: 'Button',
    media: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 266 150" fill="none">
  <defs>
    <clipPath id="clip0_3_77">
      <rect width="266" height="150" fill="white"/>
    </clipPath>
  </defs>
  <g clip-path="url(#clip0_3_77)">
    <path d="M -0.432 -0.58 L 265.568 -0.58 L 265.568 149.42 L -0.432 149.42 L -0.432 -0.58 Z" fill="white"/>
    <rect x="58.518" y="48.809" width="146.081" height="46.775" style="fill: rgb(99, 102, 241); stroke: rgb(99, 102, 241); stroke-linejoin: round; stroke-width: 3px;"/>
    <text style="fill: rgb(255, 255, 255); font-family: Arial, sans-serif; font-size: 21.2px; stroke-linejoin: round; white-space: pre;" x="101.244" y="78.989">Button</text>
  </g>
</svg>
    `,
    content: { type: typeButton },
  });

  addBlock(typeLabel, {
    // label: 'Label',
    media: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 266 150" fill="none">
      <defs>
        <clipPath id="clip0_3_77">
          <rect width="266" height="150" fill="white"/>
        </clipPath>
      </defs>
      <g clip-path="url(#clip0_3_77)">
        <path d="M -0.432 -0.58 L 265.568 -0.58 L 265.568 149.42 L -0.432 149.42 L -0.432 -0.58 Z" fill="white"/>
        <path d="M 201.012 76.102 C 201.012 72.176 197.532 70.212 191.964 70.212 L 71.551 70.212 C 65.983 70.212 62.503 72.176 62.503 76.102 L 62.503 109.478 C 62.503 112.75 65.983 115.368 71.551 115.368 L 192.66 115.368 C 198.228 115.368 201.708 112.75 201.708 109.478 L 201.708 76.757 L 201.012 76.102 Z M 194.052 109.478 L 68.767 109.478 L 68.767 76.757 L 194.052 76.757 L 194.052 109.478 Z" style="fill: rgb(99, 102, 241);"/>
        <rect width="97.443" height="32.721" x="61.807" y="30.947" rx="0.5" style="fill: rgb(99, 102, 241);"/>
        <path d="M 75.728 83.301 L 82.688 83.301 L 82.688 102.934 L 75.728 102.934 L 75.728 83.301 Z" style="fill: rgb(99, 102, 241);"/>
        <text style="fill: rgb(255, 255, 255); font-family: Arial, sans-serif; font-size: 7.7px; white-space: pre;" x="77.115" y="48.744" transform="matrix(2.952908, 0, 0, 2.875858, -146.170761, -85.276283)">Label</text>
      </g>
    </svg>
    `,
    content: { type: typeLabel },
  });

  // addBlock(typeCheckbox, {
  //   label: 'Checkbox',
  //   media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 17l-5-5 1.41-1.42L10 14.17l7.59-7.59L19 8m0-5H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5a2 2 0 0 0-2-2z"></path></svg>',
  //   content: { type: typeCheckbox },
  // });

  // addBlock(typeRadio, {
  //   label: 'Radio',
  //   media: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m0-18C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 5c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"></path></svg>',
  //   content: { type: typeRadio },
  // });
}

export default blocks;
