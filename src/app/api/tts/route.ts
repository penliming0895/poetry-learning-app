import { NextRequest, NextResponse } from 'next/server';
import { TTSClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { text, speaker, speechRate } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Extract headers from request
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

    const config = new Config();
    const ttsClient = new TTSClient(config, customHeaders);

    const response = await ttsClient.synthesize({
      uid: 'user_' + Date.now(),
      text,
      speaker: speaker || 'zh_female_xueayi_saturn_bigtts',
      audioFormat: 'mp3',
      sampleRate: 24000,
      speechRate: speechRate || 0, // -50 到 100，0 是正常速度
      loudnessRate: 0
    });

    return NextResponse.json({
      audioUri: response.audioUri,
      audioSize: response.audioSize
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'Failed to synthesize speech' },
      { status: 500 }
    );
  }
}
