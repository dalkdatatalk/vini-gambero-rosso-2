import { defineComponent, h } from 'vue';
import { defineNuxtPlugin } from '#imports';
import { Icon as IconifyIcon } from '@iconify/vue';

const WrappedIcon = defineComponent({
  name: 'Icon',
  props: {
    name: { type: String, required: true },
    size: { type: [String, Number], default: undefined },
    color: { type: String, default: undefined },
    rotate: { type: [String, Number], default: undefined },
    inline: { type: Boolean, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h(
        IconifyIcon,
        {
          icon: props.name,
          width: props.size,
          height: props.size,
          color: props.color,
          rotate: props.rotate,
          inline: props.inline,
        },
        slots.default ? slots.default() : undefined
      );
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Icon', WrappedIcon);
});
