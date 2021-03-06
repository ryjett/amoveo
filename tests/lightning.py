from get_request import request

def assertEqual(x, y):
    if (x != y):
        print("fail\n")

def lightning_test():
    print("lightning test")
    request(1, 'sync', [[127,0,0,1], 3020], 0.05)
    request(1, 'sync', [[127,0,0,1], 3030], 0.05)
    pub1 = 'BEdcBeV8yXcki/s2Lk2aJoCG59/82yacIKdYSW+5p6ZahDZoIUnOiA790dj3KsNSwgdqq1L6IPU5bcq4+ukGCgI='
    priv1 = 'NQNPEkn+ERzNCH0T4FPYzv3PEXl36S5cGGP0NNMS/Fo='
    pub2 = 'BFRjuCgudSTRU79SVoCBvWi55+N1QethvQI6LKUCoEPHvIfedkQLxnuD2VJHqoLrULmXyexRWs2sOTwyLsdyL+E='
    priv2 = 'IxHs+qu1daOGQ/PfBN4LHM3h2W/5X3dGYfb4q3lkupw='
    brainwallet = ''
    request(1, 'dump_channels', [])
    request(2, 'dump_channels', [])
    request(3, 'dump_channels', [], 0.05)
    request(2, 'load_key', [pub1, priv1, brainwallet])
    request(3, 'load_key', [pub2, priv2, brainwallet])
    request(1, 'create_account', [pub1, 1000000000], 0.05)
    request(1, 'create_account', [pub2, 1000000000], 0.05)
    request(1, 'sync', [[127,0,0,1], 3030], 0.05)
    request(2, 'sync', [[127,0,0,1], 3030], 0.05)
    fee = 51000
    request(1, 'new_channel_with_server', [[127,0,0,1], 3030, 1, 10000, 9999, fee, 4, 1000], 0.05)
    request(2, 'sync', [[127,0,0,1], 3030], 0.05)
    request(2, 'new_channel_with_server', [[127,0,0,1], 3030, 2, 10000, 9999, fee, 4, 1000], 0.05)
    request(1, 'sync', [[127,0,0,1], 3030], 0.05)
    request(1, 'channel_spend', [[127,0,0,1], 3030, 777], 0.05)
    request(1, 'lightning_spend', [[127,0,0,1], 3030, pub1, 4, 10], 0.05)
    request(2, 'pull_channel_state', [[127,0,0,1], 3030], 0.05)
    request(1, 'pull_channel_state', [[127,0,0,1], 3030], 0.05)
    pub3 = 'BIVZhs16gtoQ/uUMujl5aSutpImC4va8MewgCveh6MEuDjoDvtQqYZ5FeYcUhY/QLjpCBrXjqvTtFiN4li0Nhjo='
    request(2, 'lightning_spend', [[127,0,0,1], 3030, pub3, 4, 10], 0.05)
    request(1, 'pull_channel_state', [[127,0,0,1], 3030], 0.05)
    request(2, 'pull_channel_state', [[127,0,0,1], 3030], 0.05)
    request(1, 'sync', [[127,0,0,1], 3030], 0.05)
    request(1, 'sync', [[127,0,0,1], 3020], 0.3)
    height1 = request(1, 'height', [], 0.05)
    height2 = request(2, 'height', [], 0.05)
    height3 = request(3, 'height', [], 0.05)
    assertEqual(height1, height2)
    assertEqual(height1, height3)
    request(1, 'channel_close', [[127,0,0,1], 3030])
    request(2, 'channel_close', [[127,0,0,1], 3030])

if __name__ == "__main__":
    lightning_test()
