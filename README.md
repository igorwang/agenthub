# Next.js & NextUI Template

This is a template for creating applications using Next.js 14 (app directory) and NextUI (v2).

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/nextui-org/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@nextui-org/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## Docker base

docker build -t
docker build -t your-dockerhub-username/your-repo-name:base -f Dockerfile.base .
推送基础镜像到 Docker Hub
docker push your-dockerhub-username/your-repo-name:base

## FQA

- 如何处理流失返回
  注意配置 proxy_buffering off;

原理
在代理请求时，Nginx 默认会启用缓存（buffering）。这意味着，当 Nginx 收到上游服务器的响应时，会先将响应数据缓存到内存或磁盘上的临时文件中，直到响应的全部内容都接收完毕，再将响应数据发送给客户端。
通过 proxy_buffering off; 指令，可以关闭这种缓存行为。这时，Nginx 会直接将上游服务器的响应数据逐块（chunk）地传递给客户端，而不进行缓存。

作用
关闭缓存（buffering）具有以下作用：
减少延迟：在某些情况下，特别是对于实时应用，如 WebSocket、实时视频流或长连接，关闭缓存可以减少数据传输的延迟，因为数据不再需要先被缓存再发送给客户端。

降低内存和磁盘占用：缓存数据需要占用服务器的内存和磁盘空间，关闭缓存可以减少对这些资源的占用，特别是在处理大文件或大量数据时。
实时性要求：对于一些需要实时处理的数据流应用，如直播、实时数据推送等，关闭缓存可以确保数据尽快传递到客户端，满足实时性的需求。

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).
