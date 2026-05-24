const BRAND_IMAGES = {
  'Apple': {
    'Laptop': [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1527814050087-3796bba48e88?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1524678906949-f94b3895cd6f?w=600&h=460&fit=crop'
    ],
    'Smartphone': [
      'https://images.unsplash.com/photo-1592286927505-1def25e4cda1?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=460&fit=crop'
    ],
    'Watch': [
      'https://images.unsplash.com/photo-1534169692769-ec503309ca3e?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1517502884422-41eaaced0168?w=600&h=460&fit=crop'
    ],
    'Tablet': [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1542751110-97646af24e66?w=600&h=460&fit=crop'
    ],
    'Headphones': [
      'https://images.unsplash.com/photo-1572530331487-5053e294bc9c?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=460&fit=crop'
    ]
  },
  'Samsung': {
    'Smartphone': [
      'https://images.unsplash.com/photo-1610945415295-d9bbf7ce3350?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1583573636246-18cb2246697f?w=600&h=460&fit=crop'
    ],
    'Laptop': [
      'https://images.unsplash.com/photo-1588872657840-18491fbf84d8?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1562819021-bfd19207f74e?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1524782955961-b3409d552549?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=460&fit=crop'
    ],
    'Tablet': [
      'https://images.unsplash.com/photo-1583391814364-ec62f2d8e7e4?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1600267175161-892a5c529157?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1545432099-74d440642117?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=460&fit=crop'
    ],
    'Watch': [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=460&fit=crop'
    ],
    'Headphones': [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=460&fit=crop'
    ],
    'Speaker': [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=460&fit=crop'
    ]
  },
  'Nike': {
    'Sneakers': [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&h=460&fit=crop'
    ],
    'Jacket': [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1544923246-77307dd270b1?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=460&fit=crop'
    ],
    'Backpack': [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&h=460&fit=crop'
    ]
  },
  'Adidas': {
    'Sneakers': [
      'https://images.unsplash.com/photo-1556662206-f033a0ca6718?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1579671156992-580a9d1a8b93?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1597045566677-8cc4efb4d5c6?w=600&h=460&fit=crop'
    ],
    'Jacket': [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1559559056-a386f5e31d84?w=600&h=460&fit=crop'
    ],
    'Backpack': [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=460&fit=crop'
    ]
  },
  'HP': {
    'Laptop': [
      'https://images.unsplash.com/photo-1588872657840-18491fbf84d8?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1527814050087-3796bba48e88?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1524782955961-b3409d552549?w=600&h=460&fit=crop'
    ],
    'Tablet': [
      'https://images.unsplash.com/photo-1600267175161-892a5c529157?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1545432099-74d440642117?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1583391814364-ec62f2d8e7e4?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&h=460&fit=crop'
    ]
  },
  'Dell': {
    'Laptop': [
      'https://images.unsplash.com/photo-1562819021-bfd19207f74e?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1527814050087-3796bba48e88?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1588872657840-18491fbf84d8?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=460&fit=crop'
    ],
    'Tablet': [
      'https://images.unsplash.com/photo-1545432099-74d440642117?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1600267175161-892a5c529157?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1583391814364-ec62f2d8e7e4?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1552062407-98eeb64c6a62?w=600&h=460&fit=crop'
    ],
    'Monitor': [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&h=460&fit=crop'
    ]
  },
  'Sony': {
    'Headphones': [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=460&fit=crop'
    ],
    'Speaker': [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1614613535308-eb5fbd8952ff?w=600&h=460&fit=crop'
    ],
    'Camera': [
      'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1613933960683-b97c96f1dfa4?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1598299250818-f0eef7eb9afd?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=460&fit=crop'
    ],
    'Gaming Console': [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=460&fit=crop', // Game controller
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&h=460&fit=crop'  // PlayStation Console
    ],
    'Laptop': [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=460&fit=crop'
    ]
  },
  'Google': {
    'Smartphone': [
      'https://images.unsplash.com/photo-1616305696787-e5eca325ff62?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=460&fit=crop'
    ],
    'Tablet': [
      'https://images.unsplash.com/photo-1600267175161-892a5c529157?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1545432099-74d440642117?w=600&h=460&fit=crop'
    ],
    'Watch': [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&h=460&fit=crop'
    ],
    'Laptop': [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=460&fit=crop'
    ]
  },
  'Asus': {
    'Laptop': [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=460&fit=crop'
    ],
    'Gaming Console': [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&h=460&fit=crop'
    ],
    'Smartphone': [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=460&fit=crop'
    ]
  },
  'Puma': {
    'Sneakers': [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=460&fit=crop', // Puma shoes
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=460&fit=crop'
    ],
    'Jacket': [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=460&fit=crop'
    ],
    'Backpack': [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=460&fit=crop'
    ]
  },
  'Reebok': {
    'Sneakers': [
      'https://images.unsplash.com/photo-1597045566677-8cc4efb4d5c6?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1579671156992-580a9d1a8b93?w=600&h=460&fit=crop'
    ],
    'Jacket': [
      'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=600&h=460&fit=crop'
    ],
    'Backpack': [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&h=460&fit=crop'
    ]
  },
  'Philips': {
    'Headphones': [
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=460&fit=crop'
    ],
    'Blender': [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=460&fit=crop'
    ],
    'Lamp': [
      'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=460&fit=crop'
    ],
    'Speaker': [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=460&fit=crop'
    ]
  },
  'JBL': {
    'Speaker': [
      'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=600&h=460&fit=crop', // JBL portable speaker
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=460&fit=crop'
    ],
    'Headphones': [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=460&fit=crop'
    ]
  },
  "Levi's": {
    'Jacket': [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=460&fit=crop', // Denim jacket
      'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=600&h=460&fit=crop'
    ],
    'Sneakers': [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=460&fit=crop'
    ],
    'Backpack': [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=460&fit=crop'
    ],
    'Sunglasses': [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=460&fit=crop'
    ]
  },
  'H&M': {
    'Jacket': [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=460&fit=crop'
    ],
    'Sunglasses': [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=460&fit=crop'
    ],
    'Backpack': [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=460&fit=crop'
    ],
    'Sneakers': [
      'https://images.unsplash.com/photo-1556662206-f033a0ca6718?w=600&h=460&fit=crop'
    ]
  },
  'Uniqlo': {
    'Jacket': [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=460&fit=crop'
    ],
    'Backpack': [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=460&fit=crop'
    ],
    'Sunglasses': [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=460&fit=crop'
    ]
  },
  'Ikea': {
    'Lamp': [
      'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=460&fit=crop'
    ],
    'Blender': [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=460&fit=crop'
    ],
    'Backpack': [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=460&fit=crop'
    ]
  },
  'KitchenAid': {
    'Blender': [
      'https://images.unsplash.com/photo-KJlEhRImMlQ?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-zFOzKXnFpII?w=600&h=460&fit=crop'
    ],
    'Lamp': [
      'https://images.unsplash.com/photo-uXoTRyhKIIs?w=600&h=460&fit=crop'
    ]
  },
  'Bosch': {
    'Blender': [
      'https://images.unsplash.com/photo-tdUOpMLDPGo?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-1584568694244-14fbbc50d737?w=600&h=460&fit=crop'
    ],
    'Lamp': [
      'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=460&fit=crop'
    ],
    'Camera': [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=460&fit=crop'
    ]
  },
  'Amazon': {
    'Tablet': [
      'https://images.unsplash.com/photo-Ia4DajEUess?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-gm18kqu9TxQ?w=600&h=460&fit=crop'
    ],
    'Smartphone': [
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=460&fit=crop'
    ],
    'Speaker': [
      'https://images.unsplash.com/photo-_tfCdU7tuJ0?w=600&h=460&fit=crop',
      'https://images.unsplash.com/photo-8Be04uSl5zc?w=600&h=460&fit=crop'
    ],
    'Watch': [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=460&fit=crop'
    ],
    'Headphones': [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=460&fit=crop'
    ]
  }
};

const GENERIC_TYPE_IMAGES = {
  'Headphones': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&h=460&fit=crop'
  ],
  'Watch': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&h=460&fit=crop'
  ],
  'Blender': [
    'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=460&fit=crop'
  ],
  'Sneakers': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=460&fit=crop'
  ],
  'Backpack': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=460&fit=crop'
  ],
  'Jacket': [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=460&fit=crop'
  ],
  'Laptop': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=460&fit=crop'
  ],
  'Speaker': [
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&h=460&fit=crop'
  ],
  'Camera': [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=460&fit=crop'
  ],
  'Lamp': [
    'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=460&fit=crop'
  ],
  'Smartphone': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=460&fit=crop'
  ],
  'Gaming Console': [
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&h=460&fit=crop'
  ],
  'Tablet': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=460&fit=crop'
  ],
  'Yoga Mat': [
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=460&fit=crop'
  ],
  'Sunglasses': [
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=460&fit=crop'
  ],
  'Monitor': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=460&fit=crop',
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&h=460&fit=crop'
  ]
};

const PRODUCT_TYPES = Object.keys(GENERIC_TYPE_IMAGES);
const BRANDS = Object.keys(BRAND_IMAGES);

/**
 * Matches a product name to the most specific type from our known list.
 */
function detectProductType(name) {
  const lowercaseName = name.toLowerCase();
  for (const type of PRODUCT_TYPES) {
    // Check plural, singular, and spaces (e.g. "gaming console", "console")
    if (lowercaseName.includes(type.toLowerCase())) {
      return type;
    }
    // Specially handle some sub-types or aliases
    if (type === 'Sneakers' && (lowercaseName.includes('shoe') || lowercaseName.includes('sneaker'))) {
      return 'Sneakers';
    }
    if (type === 'Smartphone' && (lowercaseName.includes('phone') || lowercaseName.includes('iphone'))) {
      return 'Smartphone';
    }
    if (type === 'Gaming Console' && (lowercaseName.includes('playstation') || lowercaseName.includes('xbox') || lowercaseName.includes('switch') || lowercaseName.includes('console'))) {
      return 'Gaming Console';
    }
  }
  return null;
}

/**
 * Matches a brand name or detects it from the product name.
 */
function detectBrand(name, providedBrand) {
  if (providedBrand && BRAND_IMAGES[providedBrand]) {
    return providedBrand;
  }
  
  const lowercaseName = name.toLowerCase();
  for (const brand of BRANDS) {
    if (lowercaseName.includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return null;
}

/**
 * Resolves an exact, high-quality product image URL based on the product details.
 */
function getExactProductImage(name, brand = '', categoryName = '', seedIndex = 0) {
  const detectedB = detectBrand(name, brand);
  const detectedT = detectProductType(name) || detectProductType(categoryName);
  
  // 1. Try brand-specific type image
  if (detectedB && detectedT && BRAND_IMAGES[detectedB] && BRAND_IMAGES[detectedB][detectedT]) {
    const list = BRAND_IMAGES[detectedB][detectedT];
    return list[seedIndex % list.length];
  }
  
  // 2. Try generic type image
  if (detectedT && GENERIC_TYPE_IMAGES[detectedT]) {
    const list = GENERIC_TYPE_IMAGES[detectedT];
    return list[seedIndex % list.length];
  }
  
  // 3. Fallback to LoremFlickr with exact keywords
  const brandTerm = detectedB || brand || '';
  const typeTerm = detectedT || categoryName || 'product';
  const query = [brandTerm, typeTerm].filter(Boolean).join(',').toLowerCase();
  
  return `https://loremflickr.com/600/460/${encodeURIComponent(query)}/all?lock=${seedIndex + 1}`;
}

module.exports = {
  getExactProductImage,
  detectProductType,
  detectBrand
};
