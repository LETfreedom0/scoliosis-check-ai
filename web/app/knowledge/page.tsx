'use client';

import { BookOpen } from 'lucide-react';

export default function KnowledgePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#2c7a7b] flex items-center justify-center gap-3">
          <BookOpen className="h-8 w-8" />
          脊柱健康知识库
        </h1>
      </div>

      <article className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-[#2c7a7b] mb-4 pb-2 border-b-2 border-[#e6fffa]">
          什么是脊柱侧弯？
        </h2>
        <p className="text-gray-600 leading-relaxed">
          脊柱侧弯（Scoliosis）是指脊柱的一个或数个节段在冠状面上偏离身体中线向侧方弯曲，形成一个带有弧度的脊柱畸形，通常还伴有脊柱的旋转和矢状面上后凸或前凸的增加或减少。Cobb 角大于 10 度即可诊断为脊柱侧弯。
        </p>
      </article>

      <article className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-[#2c7a7b] mb-4 pb-2 border-b-2 border-[#e6fffa]">
          常见症状有哪些？
        </h2>
        <p className="text-gray-600 mb-4">早期脊柱侧弯可能没有明显的不适，但可以通过观察体态发现蛛丝马迹：</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li><strong>双肩不等高：</strong> 一侧肩膀比另一侧高。</li>
          <li><strong>肩胛骨突出：</strong> 一侧肩胛骨比另一侧更突出。</li>
          <li><strong>腰部不对称：</strong> 腰部一侧出现褶皱，或者骨盆不等高。</li>
          <li><strong>身体倾斜：</strong> 身体向一侧倾斜，站立时重心不稳。</li>
        </ul>
      </article>

      <article className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-[#2c7a7b] mb-4 pb-2 border-b-2 border-[#e6fffa]">
          如何预防与日常保养？
        </h2>
        <p className="text-gray-600 mb-4">虽然特发性脊柱侧弯的确切病因尚不明确，但良好的生活习惯有助于脊柱健康：</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li><strong>保持正确姿势：</strong> 站立、坐着时保持脊柱挺直，避免长时间弯腰驼背。</li>
          <li><strong>加强核心肌群：</strong> 游泳（尤其是蛙泳）、普拉提、瑜伽等运动有助于增强背部肌肉力量，稳固脊柱。</li>
          <li><strong>避免单肩负重：</strong> 尽量使用双肩包，并确保背带长短一致。</li>
          <li><strong>定期筛查：</strong> 青少年处于生长发育期，建议每年进行一次脊柱侧弯筛查。</li>
        </ul>
      </article>
    </div>
  );
}
