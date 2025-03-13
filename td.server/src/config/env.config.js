import { BitbucketEnv } from '../env/Bitbucket.js';
import { EncryptionEnv } from '../env/Encryption.js';
import { getEnvironment } from '../env/Env.js';
import { GithubEnv } from '../env/Github.js';
import { GitlabEnv } from '../env/Gitlab.js';
import { GoogleEnv } from '../env/Google.js';
import { ThreatDragonEnv } from '../env/ThreatDragon.js';

const tryLoadDotEnv = () => {
    const github = new GithubEnv();
    const gitlab = new GitlabEnv();
    const bitbucket = new BitbucketEnv();
    const encryption = new EncryptionEnv();
    const threatDragon = new ThreatDragonEnv();
    const google = new GoogleEnv();
    const env = getEnvironment();
    env.addProvider(github);
    env.addProvider(gitlab);
    env.addProvider(encryption);
    env.addProvider(bitbucket);
    env.addProvider(threatDragon);
    env.addProvider(google);
    env.hydrate();
};

export default { tryLoadDotEnv };
