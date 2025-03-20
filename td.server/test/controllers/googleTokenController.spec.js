import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import googleTokenController from '../../src/controllers/googleTokenController.js';

const { expect } = chai;
chai.use(sinonChai);

describe('controllers/googleTokenController.js', () => {
    const mockRes = {
        status: () => mockRes,
        json: () => {},
        set: sinon.stub()
    };

    describe('getGoogleToken', () => {
        let sandbox;
        
        beforeEach(() => {
            sandbox = sinon.createSandbox();
            sinon.stub(mockRes, 'json');
            mockRes.set.resetHistory();
        });
        
        afterEach(() => {
            sandbox.restore();
        });
        
        it('should return the access token from the provider', async () => {
            const mockReq = {
                provider: {
                    access_token: 'test-google-token',
                    other_data: 'should-not-be-exposed'
                },
                user: {
                    username: 'testuser'
                }
            };
            
            await googleTokenController.getGoogleToken(mockReq, mockRes);
            
            expect(mockRes.set).to.have.been.calledWith('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            expect(mockRes.json).to.have.been.calledWith(sinon.match({
                status: 200,
                data: {
                    accessToken: 'test-google-token'
                }
            }));
        });
        
        it('should throw an error if no access token is available', async () => {
            const mockReq = {
                provider: {},
                user: {
                    username: 'testuser'
                }
            };
            
            await googleTokenController.getGoogleToken(mockReq, mockRes);
            
            expect(mockRes.json).to.have.been.calledWith(sinon.match({
                status: 500
            }));
        });
        
        it('should throw an error if no provider is available', async () => {
            const mockReq = {
                user: {
                    username: 'testuser'
                }
            };
            
            await googleTokenController.getGoogleToken(mockReq, mockRes);
            
            expect(mockRes.json).to.have.been.calledWith(sinon.match({
                status: 500
            }));
        });
    });
});