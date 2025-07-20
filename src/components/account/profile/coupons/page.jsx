import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';

export default function CouponsSection() {
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('coupons');
    return saved ? JSON.parse(saved) : [];
  });
  const [showGame, setShowGame] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [lastSpinDate, setLastSpinDate] = useState(() => {
    return localStorage.getItem('lastSpinDate') || null;
  });
  const sketchRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastSpinDate && lastSpinDate === today) {
      setCanSpin(false);
    } else {
      setCanSpin(true);
    }
  }, [lastSpinDate]);

  const generateCoupon = (index) => {
    const couponCodes = [
      { code: 'SAVE10', description: 'Giảm 10% cho đơn hàng tiếp theo' },
      { code: 'DISCOUNT20', description: 'Giảm 20% cho đơn hàng tiếp theo' },
      { code: 'FREESHIP', description: 'Miễn phí vận chuyển' },
      { code: 'SALE15', description: 'Giảm 15% cho đơn hàng tiếp theo' },
      { code: 'EXTRA5', description: 'Giảm 5% cho đơn hàng tiếp theo' },
      { code: 'SAVE30', description: 'Giảm 30% cho đơn hàng tiếp theo' },
    ];
    const selectedCoupon = couponCodes[index % couponCodes.length];
    const newCoupon = {
      id: Date.now(),
      code: selectedCoupon.code,
      description: selectedCoupon.description,
      timestamp: new Date().toISOString(),
    };
    setCoupons([...coupons, newCoupon]);
    setLastSpinDate(new Date().toISOString().split('T')[0]);
    localStorage.setItem('lastSpinDate', new Date().toISOString().split('T')[0]);
    setCanSpin(false);
    alert(`Chúc mừng! Bạn nhận được mã giảm giá: ${newCoupon.code}`);
  };

  useEffect(() => {
    if (showGame) {
      const sketch = (p) => {
        let angle = 0;
        let isSpinning = false;
        let targetAngle = 0;
        let spinSpeed = 0;
        const segments = 6;
        const segmentAngle = 360 / segments;
        const rewards = ['10%', '20%', '5%', 'Free Ship', '50% Ship', 'No one'];
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];

        p.setup = () => {
          p.createCanvas(400, 400);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(20);
        };

        p.draw = () => {
          p.background(255);
          p.translate(p.width / 2, p.height / 2);

          // Draw wheel
          for (let i = 0; i < segments; i++) {
            p.fill(colors[i]);
            p.arc(0, 0, 300, 300, p.radians(i * segmentAngle), p.radians((i + 1) * segmentAngle));
            p.push();
            p.rotate(p.radians(i * segmentAngle + segmentAngle / 2));
            p.fill(0);
            p.text(rewards[i], 100, 0);
            p.pop();
          }

          // Rotate wheel
          p.rotate(p.radians(angle));
          p.fill(0);
          p.triangle(-20, -150, 20, -150, 0, -180);

          if (isSpinning) {
            angle += spinSpeed;
            spinSpeed *= 0.98; // Slow down
            if (spinSpeed < 0.1) {
              isSpinning = false;
              const finalSegment = Math.floor(((angle % 360) + 360) % 360 / segmentAngle);
              generateCoupon(finalSegment);
            }
          }
        };

        p.mousePressed = () => {
          if (canSpin && !isSpinning && p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            isSpinning = true;
            spinSpeed = p.random(10, 20);
            targetAngle = p.random(720, 1440); // Spin 2-4 full rotations
            angle = 0;
          }
        };
      };

      const p5Instance = new p5(sketch, sketchRef.current);
      return () => {
        p5Instance.remove();
      };
    }
  }, [showGame, canSpin]);

  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">PHIẾU GIẢM GIÁ</h2>
      {showGame ? (
        <div>
          <p className="text-sm mb-4">Nhấn vào vòng quay để quay và nhận phiếu giảm giá!</p>
          <div ref={sketchRef} className="mb-4 mx-auto" style={{ maxWidth: '400px' }}></div>
          <button
            onClick={() => setShowGame(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
          >
            HỦY TRÒ CHƠI
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm mb-4">Hiện tại bạn có {coupons.length} phiếu giảm giá.</p>
          {coupons.length > 0 && (
            <ul className="space-y-4 mb-4">
              {coupons.map((coupon) => (
                <li key={coupon.id} className="border p-4 rounded">
                  <p><strong>Mã:</strong> {coupon.code}</p>
                  <p><strong>Mô tả:</strong> {coupon.description}</p>
                  <p><strong>Thời gian:</strong> {coupon.timestamp}</p>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => setShowGame(true)}
            disabled={!canSpin}
            className={`px-4 py-2 text-white rounded-lg text-sm ${
              canSpin ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {canSpin ? 'TÌM PHIẾU GIẢM GIÁ' : 'BẠN ĐÃ QUAY HÔM NAY'}
          </button>
          {!canSpin && (
            <p className="text-sm text-gray-600 mt-2">
              Bạn có thể quay lại vào ngày mai!
            </p>
          )}
        </div>
      )}
    </div>
  );
}