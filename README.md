# KimiSupporter 0.1.0

KimiSupporter 是 Aide 的月之暗面 Kimi 社区插件，采用 [MIT 许可](LICENSE)。安装并启用后，Aide 使用离线费率档案估算中国区官方模型的对话成本。包含 Moonshot 余额适配的 Aide 还可读取所选 API Key 对应的账户余额。

## 使用

1. 在 [Aide 插件市场](https://skyelan1999.github.io/aide-pkg-shop/) 搜索 KimiSupporter，或下载 [Release ZIP](https://github.com/skyelan1999/aide-pkg-KimiSupporter/releases) 并从 Aide 插件面板导入。启用插件。
2. 在模型设置中选择「Moonshot / Kimi」，填写中国区官方地址 `https://api.moonshot.cn/v1` 与对应的 API Key。选择已开通的模型。
3. 在账户面板选择该提供商和密钥。兼容的 Aide 可查询可用余额、现金和代金券，金额为人民币元。启用余额查询前可先核对 [官方接口说明](https://platform.kimi.com/docs/api/balance)。

费率要求支持 `providerSupport` protocol 1 的 Aide（0.1.17.5 RC5 或更新版本）。余额另外要求宿主已内置 Moonshot 账户余额适配。Aide 加载费率档案，将所选密钥保存在自己的保险库，并向月之暗面官方余额接口鉴权。插件无需配置其他密钥。

## 模型费率

以下是 **2026-11-19** 核验的中国区标准实时费率，单位为人民币元／百万 token。匹配 `https://api.moonshot.cn/v1` 和精确模型 ID。国际区、第三方网关和未知模型由 Aide 使用其已有的费率选择逻辑。

| 模型 ID | 未命中输入 | 缓存命中输入 | 输出 |
| --- | ---: | ---: | ---: |
| `kimi-k3.1-pro` | 13.00 | 1.30 | 68.00 |
| `kimi-k3.1-pro-highspeed` | 26.00 | 1.30 | 136.00 |
| `kimi-k3` | 20.00 | 2.00 | 100.00 |
| `kimi-k2.7-code` | 6.50 | 1.30 | 27.00 |
| `kimi-k2.7-code-highspeed` | 13.00 | 2.60 | 54.00 |
| `kimi-k2.6` | 6.50 | 1.10 | 27.00 |

K2 三款模型目前面向 2026 年 11 月 1 日前注册的用户，官方计划于 2026 年 12 月底全面下线。费用估算覆盖上表的输入、缓存命中和输出列。单独计费的缓存写入、批处理、联网工具、税费与账户折扣以官方账单为准。档案随插件更新。[模型推理定价](https://platform.kimi.com/docs/pricing/chat) · [模型列表](https://platform.kimi.com/docs/models)

## 验证与打包

```sh
node --test test/catalog.test.cjs
python3 scripts/package.py
cd dist && shasum -a 256 -c SHA256SUMS
```

安装包和市场使用同一个 ZIP。包内的 JavaScript 入口和 JSON 档案适用于 Windows、macOS 和 Linux。
