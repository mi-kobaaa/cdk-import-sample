# cdk import 体験セットへようこそ！

これは`cdk import`を体験してみたい人向けのリポジトリです。

## bootstrapについての注意

`cdk import`を利用するにはbootstrapバージョンが12以上である必要があります。
一度でも実行している場合、パラメータストアでバージョンが適しているか確認しましょう！

CDK自体を初めて触るよ！という方は`cdk bootstrap`を対象アカウントへ実行しておくする必要があります。
[AWS公式](https://aws.amazon.com/jp/getting-started/guides/setup-cdk/module-two/)が分かりやすい手順を作ってくれているので確認しながらやってみましょう！

## 使い方

任意のディレクトリへリポジトリをクローンします
`git clone https://github.com/mi-kobaaa/cdk-import-sample.git`

クローンしたディレクトリへ移動します
`cd cdk-import-sample`

必要なnodeモジュールをインストールしましょう！
`npm install`

これで準備は整いました！

## とりあえずデプロイしてみる

まずはコードに変更を加えずデプロイを行います。

`cdk deploy`

これで下記構成が出来上がります
![image](https://user-images.githubusercontent.com/69611246/178479718-26214d63-1577-4d68-9b1c-7209f2d22393.png)

## S3bucketを手動で作成する

続いて取り込み用のS3を作成しましょう！

作成方法はなんでもいいですが、サンプルCLIを書いておきます。

コピーする場合は`ばけっとねーむだよ！`部分を適時変更してください。

```
aws s3 mb s3://ばけっとねーむだよ！
aws s3api put-public-access-block --bucket ばけっとねーむだよ！ --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
aws s3api put-bucket-encryption --bucket ばけっとねーむだよ！ --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'
```

bucket自体は一行目のコマンドで作成できますが、個人的な気持ちでブロックパブリック設定とデフォルト暗号化を入れております。

ここまで実行すると下記のような構成になっています。
![image](https://user-images.githubusercontent.com/69611246/178481386-82699eac-f3fb-46b7-8c5c-f86ffae56a80.png)

## S3bucketを取り込んでみる

本題の`cdk import`です。

`lib/cdk-import-sample.ts`ファイルのコードを修正します。

下記2箇所のコメントアウトを外してください。

`// import * as s3 from "aws-cdk-lib/aws-s3";`
`// const bucket = new s3.Bucket(this, "AlbBucket");`

続いてimportを実行します。

ターミナル上で下記コマンドを実行してください。
`cdk import`

bucketnameを教えて！と聞かれますので作成したS3bucketの名前を入れてあげましょう
<img width="630" alt="image" src="https://user-images.githubusercontent.com/69611246/178482382-c0f04657-f145-42ee-ac9b-e362f221aa04.png">

その後、このような画面が表示されれば取り込み完了です！
<img width="634" alt="image" src="https://user-images.githubusercontent.com/69611246/178482564-24f042d2-bfe6-49dd-864d-ad6b61f59a1c.png">

念の為、環境との差分をチェックしましょう。
`cdk diff`

no differenceが返ってくれば問題なくS3bucketのcdk取り込みが完了しています。

## せっかくなのでS3bucketを操作してみる

下記箇所のコメントアウトを外してください。

`// alb.logAccessLogs(bucket);`

この状態でデプロイを行います。

`cdk deploy`

色々とリソース変更されていることが分かります。
<img width="516" alt="image" src="https://user-images.githubusercontent.com/69611246/178483130-f1acea0b-1414-459b-8973-fb967be23f17.png">

この状態でデプロイを継続するとALBのアクセスログがS3bucketに保存されるようになります。
もちろんバケットポリシーもCDK側でよしなにしてくれています、やったね！

## 後片付け

CDKスタックを削除します。
`cdk destroy`

自動削除されないリソースがあるので手動削除します。
- `作成したS3bucket`
- `CdkImportSampleStack`から始まるCloudwatch loggroup
- `sample-image`というECR内のイメージ

# 以上で完了です！お疲れ様でした！